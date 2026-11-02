import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { SupportChatService } from '../../services/support-chat.service';
import { SupportChatResponse, SupportChatStatus, SupportSource } from '../../models/supportChat';

export interface ChatEntry {
  role: 'user' | 'assistant';
  text: string;
  status?: SupportChatStatus;
  sources?: SupportSource[];
  notice?: string | null;
  isError?: boolean;
}

/**
 * Sayfanın sağ altında açılır/kapanır destek asistanı. Mesajlar yalnızca {{ }} interpolasyonuyla
 * (otomatik HTML kaçışı) gösterilir; model çıktısı asla innerHTML olarak çalıştırılmaz.
 */
@Component({
  selector: 'app-support-chat',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, RouterLink],
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.css']
})
export class SupportChatComponent {
  static readonly MAX_LENGTH = 1000;
  readonly maxLength = SupportChatComponent.MAX_LENGTH;
  readonly locale = 'tr-TR';

  isOpen = false;
  isSending = false;
  draft = '';
  sessionId: string | null = null;
  messages: ChatEntry[] = [];
  /** Hata sonrası "Tekrar dene" ile aynı mesajı yeniden göndermek için. */
  failedMessage: string | null = null;

  @ViewChild('input') input?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('log') log?: ElementRef<HTMLElement>;
  @ViewChild('toggleButton') toggleButton?: ElementRef<HTMLButtonElement>;

  constructor(private supportChatService: SupportChatService) { }

  /** Backend'in url alanı href olarak kullanılmaz; bağlantı kaynak kimliğinden uygulama içinde üretilir. */
  isBranchSource(source: SupportSource): boolean {
    return source.id.startsWith('branch-');
  }

  get canSend(): boolean {
    return !this.isSending && this.draft.trim().length > 0 && this.draft.length <= this.maxLength;
  }

  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  open(): void {
    this.isOpen = true;
    setTimeout(() => this.input?.nativeElement.focus());
  }

  close(): void {
    this.isOpen = false;
    setTimeout(() => this.toggleButton?.nativeElement.focus());
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.send();
    }
  }

  send(): void {
    if (!this.canSend) {
      return;
    }
    const message = this.draft.trim();
    this.draft = '';
    this.messages.push({ role: 'user', text: message });
    this.dispatch(message);
  }

  retry(): void {
    if (this.failedMessage && !this.isSending) {
      // Hata balonunu kaldır; kullanıcı mesajı zaten listede.
      this.messages = this.messages.filter(m => !m.isError);
      this.dispatch(this.failedMessage);
    }
  }

  reset(): void {
    if (this.isSending) {
      return;
    }
    this.messages = [];
    this.sessionId = null;
    this.failedMessage = null;
    this.draft = '';
    this.input?.nativeElement.focus();
  }

  private dispatch(message: string): void {
    this.isSending = true;
    this.failedMessage = null;
    this.scrollToBottom();

    this.supportChatService
      .sendMessage({ message, sessionId: this.sessionId, locale: this.locale })
      .pipe(finalize(() => {
        this.isSending = false;
        this.scrollToBottom();
      }))
      .subscribe({
        next: response => this.handleAnswer(response.data),
        error: (error: HttpErrorResponse) => this.handleError(error, message)
      });
  }

  private handleAnswer(data: SupportChatResponse): void {
    this.sessionId = data.sessionId ?? this.sessionId;
    this.messages.push({
      role: 'assistant',
      text: data.answer,
      status: data.status,
      sources: data.sources ?? [],
      notice: data.notice
    });
  }

  private handleError(error: HttpErrorResponse, message: string): void {
    const data: SupportChatResponse | undefined = error.error?.data;
    let text: string;

    if (error.status === 0) {
      text = 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.';
    } else if (data?.status === 'session_not_found') {
      // Oturum geçersiz: yeni oturumla tekrar denenebilir.
      this.sessionId = null;
      text = data.answer;
    } else if (data?.answer) {
      text = data.answer;
    } else if (error.status === 429) {
      text = error.error?.message ?? 'Çok fazla istek gönderdiniz. Lütfen biraz sonra tekrar deneyin.';
    } else {
      text = 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
    }

    // Geçersiz istek aynı mesajla tekrar denenirse yine reddedilir; tekrar deneme sunulmaz.
    this.failedMessage = data?.status === 'invalid_request' ? null : message;
    this.messages.push({ role: 'assistant', text, isError: true, status: data?.status });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.log?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }
}
