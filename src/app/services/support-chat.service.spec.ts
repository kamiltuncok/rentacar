import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SupportChatService } from './support-chat.service';
import { SKIP_GLOBAL_ERROR_TOAST } from '../interceptors/error.interceptor';

describe('SupportChatService', () => {
  let service: SupportChatService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SupportChatService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('posts to the backend chat endpoint (never to Ollama) with the contract body', () => {
    service.sendMessage({ message: 'Depozito?', sessionId: null, locale: 'tr-TR' }).subscribe();

    const req = http.expectOne('https://localhost:44306/api/support/chat');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ message: 'Depozito?', sessionId: null, locale: 'tr-TR' });
    expect(req.request.url).not.toContain('11434');
    expect(req.request.context.get(SKIP_GLOBAL_ERROR_TOAST)).toBeTrue();
    req.flush({ success: true, message: null, data: { sessionId: 's', answer: 'a', status: 'answered', sources: [], notice: null } });
  });

  it('loads help articles', () => {
    service.getArticles().subscribe(r => expect(r.data.length).toBe(1));

    const req = http.expectOne('https://localhost:44306/api/support/articles');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, message: null, data: [{ id: 'deposit-policy', title: 't', category: 'c', content: 'x', isSample: false }] });
  });
});
