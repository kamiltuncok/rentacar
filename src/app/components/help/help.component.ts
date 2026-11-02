import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SupportChatService } from '../../services/support-chat.service';
import { SupportArticle } from '../../models/supportChat';

/**
 * Destek asistanının kaynak gösterdiği makalelerin listesi. Asistandaki kaynak bağlantıları
 * /help#<makale-id> adresine gelir; ilgili makaleye kaydırılır ve vurgulanır.
 */
@Component({
  selector: 'app-help',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  articles: SupportArticle[] = [];
  isLoading = true;
  loadFailed = false;
  highlightedId: string | null = null;

  constructor(private supportChatService: SupportChatService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.supportChatService.getArticles().subscribe({
      next: response => {
        this.articles = response.data;
        this.isLoading = false;
        this.route.fragment.subscribe(fragment => this.scrollTo(fragment));
      },
      error: () => {
        this.isLoading = false;
        this.loadFailed = true;
      }
    });
  }

  private scrollTo(fragment: string | null): void {
    this.highlightedId = fragment;
    if (!fragment) {
      return;
    }
    setTimeout(() => document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
}
