import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { SupportChatComponent } from './support-chat.component';
import { SupportChatService } from '../../services/support-chat.service';
import { SingleResponseModel } from '../../models/singleResponseModel';
import { SupportChatResponse } from '../../models/supportChat';

describe('SupportChatComponent', () => {
  let fixture: ComponentFixture<SupportChatComponent>;
  let component: SupportChatComponent;
  let service: jasmine.SpyObj<SupportChatService>;

  const answered = (overrides: Partial<SupportChatResponse> = {}): SingleResponseModel<SupportChatResponse> => ({
    success: true,
    message: '',
    data: {
      sessionId: 'session-1',
      answer: 'Depozito teslimde iade edilir.',
      status: 'answered',
      sources: [{ id: 'deposit-policy', title: 'Depozito', url: '/help#deposit-policy', isSample: false }],
      notice: null,
      ...overrides
    }
  });

  const element = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    service = jasmine.createSpyObj<SupportChatService>('SupportChatService', ['sendMessage']);
    await TestBed.configureTestingModule({
      imports: [SupportChatComponent],
      providers: [provideRouter([]), { provide: SupportChatService, useValue: service }]
    }).compileComponents();

    fixture = TestBed.createComponent(SupportChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens and closes the panel with an accessible toggle', fakeAsync(() => {
    const toggle = element().querySelector<HTMLButtonElement>('.sc-toggle')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(element().querySelector('[role="dialog"]')).toBeNull();

    toggle.click();
    fixture.detectChanges();
    flush();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(element().querySelector('[role="dialog"]')).not.toBeNull();
    expect(element().querySelector('[role="log"]')?.getAttribute('aria-live')).toBe('polite');
  }));

  it('does not send empty or whitespace messages', () => {
    component.draft = '   ';
    component.send();
    expect(service.sendMessage).not.toHaveBeenCalled();
    expect(component.canSend).toBeFalse();
  });

  it('sends a message, shows the answer and keeps the session id', () => {
    service.sendMessage.and.returnValue(of(answered()));
    component.draft = 'Depozito ne zaman iade edilir?';
    component.send();

    expect(service.sendMessage).toHaveBeenCalledWith({ message: 'Depozito ne zaman iade edilir?', sessionId: null, locale: 'tr-TR' });
    expect(component.messages.map(m => m.role)).toEqual(['user', 'assistant']);
    expect(component.sessionId).toBe('session-1');

    component.draft = 'Peki iptalde?';
    component.send();
    expect(service.sendMessage.calls.mostRecent().args[0].sessionId).toBe('session-1');
  });

  it('prevents duplicate submissions while a request is pending', () => {
    const pending = new Subject<SingleResponseModel<SupportChatResponse>>();
    service.sendMessage.and.returnValue(pending.asObservable());

    component.draft = 'Depozito?';
    component.send();
    component.draft = 'Depozito?';
    component.send();

    expect(service.sendMessage).toHaveBeenCalledTimes(1);
    expect(component.isSending).toBeTrue();
    pending.next(answered());
    pending.complete();
    expect(component.isSending).toBeFalse();
  });

  it('sends on Enter but not on Shift+Enter', () => {
    service.sendMessage.and.returnValue(of(answered()));
    component.draft = 'Depozito?';

    component.onKeydown(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true }));
    expect(service.sendMessage).not.toHaveBeenCalled();

    component.onKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(service.sendMessage).toHaveBeenCalledTimes(1);
  });

  it('renders model output as text, never as HTML', fakeAsync(() => {
    service.sendMessage.and.returnValue(of(answered({ answer: '<img src=x onerror="alert(1)"><b>kalın</b>' })));
    component.open();
    flush();
    component.draft = 'Depozito?';
    component.send();
    fixture.detectChanges();
    flush();

    const bubble = element().querySelectorAll('.sc-row--assistant .sc-text')[0];
    expect(bubble.textContent).toContain('<img src=x');
    expect(bubble.querySelector('img')).toBeNull();
    expect(bubble.querySelector('b')).toBeNull();
  }));

  it('shows sources as internal help links and marks sample policies', fakeAsync(() => {
    service.sendMessage.and.returnValue(of(answered({
      sources: [{ id: 'age-license-sample', title: 'Yaş', url: 'javascript:alert(1)', isSample: true }],
      notice: 'Örnek politika'
    })));
    component.open();
    flush();
    component.draft = 'Yaş sınırı?';
    component.send();
    fixture.detectChanges();
    flush();

    const link = element().querySelector<HTMLAnchorElement>('.sc-source')!;
    // Backend'in url alanı kullanılmaz; bağlantı her zaman uygulama içi /help#id olarak üretilir.
    expect(link.getAttribute('href')).toBe('/help#age-license-sample');
    expect(link.querySelector('.sc-badge')).not.toBeNull();
    expect(element().querySelector('.sc-notice')?.textContent).toContain('Örnek politika');
  }));

  it('links branch sources to the branches page', fakeAsync(() => {
    service.sendMessage.and.returnValue(of(answered({
      sources: [{ id: 'branch-3', title: 'Kadıköy Şube (İstanbul)', url: 'https://evil.example', isSample: false }]
    })));
    component.open();
    flush();
    component.draft = 'Kadıköy şubesi nerede?';
    component.send();
    fixture.detectChanges();
    flush();

    const link = element().querySelector<HTMLAnchorElement>('.sc-source')!;
    expect(link.getAttribute('href')).toBe('/branches');
    expect(link.querySelector('.sc-badge')).toBeNull();
  }));

  it('shows a support hand-off for no_reliable_answer', fakeAsync(() => {
    service.sendMessage.and.returnValue(of(answered({ status: 'no_reliable_answer', sources: [], answer: 'Bilgi yok.' })));
    component.open();
    flush();
    component.draft = 'Dolar kuru?';
    component.send();
    fixture.detectChanges();
    flush();

    expect(element().querySelector('.sc-handoff')?.textContent).toContain('info@otogez.com');
  }));

  it('shows the server error message with a retry that resends the same message', () => {
    const error = new HttpErrorResponse({
      status: 503,
      error: { success: false, data: { status: 'model_unavailable', answer: 'Asistan kullanılamıyor.', sources: [], sessionId: null, notice: null } }
    });
    service.sendMessage.and.returnValues(throwError(() => error), of(answered()));

    component.draft = 'Depozito?';
    component.send();
    expect(component.messages[1]).toEqual(jasmine.objectContaining({ isError: true, text: 'Asistan kullanılamıyor.' }));
    expect(component.failedMessage).toBe('Depozito?');

    component.retry();
    expect(service.sendMessage).toHaveBeenCalledTimes(2);
    expect(service.sendMessage.calls.mostRecent().args[0].message).toBe('Depozito?');
    expect(component.messages.map(m => m.role)).toEqual(['user', 'assistant']);
    expect(component.messages.some(m => m.isError)).toBeFalse();
  });

  it('drops an invalid session so the retry starts a new one', () => {
    component.sessionId = 'expired';
    service.sendMessage.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 404,
      error: { success: false, data: { status: 'session_not_found', answer: 'Oturum bulunamadı.', sources: [], sessionId: null, notice: null } }
    })));

    component.draft = 'Depozito?';
    component.send();

    expect(component.sessionId).toBeNull();
    expect(component.failedMessage).toBe('Depozito?');
  });

  it('does not offer retry for invalid requests and handles network errors', () => {
    service.sendMessage.and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 400, error: { data: { status: 'invalid_request', answer: 'Mesaj boş olamaz.' } } })),
      throwError(() => new HttpErrorResponse({ status: 0 })));

    component.draft = 'x';
    component.send();
    expect(component.failedMessage).toBeNull();

    component.draft = 'y';
    component.send();
    expect(component.messages[component.messages.length - 1].text).toContain('Sunucuya bağlanılamadı');
    expect(component.failedMessage).toBe('y');
  });

  it('resets the conversation', () => {
    service.sendMessage.and.returnValue(of(answered()));
    component.draft = 'Depozito?';
    component.send();

    component.reset();

    expect(component.messages).toEqual([]);
    expect(component.sessionId).toBeNull();
  });
});
