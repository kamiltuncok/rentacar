import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { SupportArticle, SupportChatRequest, SupportChatResponse } from '../models/supportChat';
import { SKIP_GLOBAL_ERROR_TOAST } from '../interceptors/error.interceptor';

/**
 * Destek asistanı uçları. Ollama'ya DOĞRUDAN gidilmez — model yalnızca backend'den çağrılır.
 * Sohbet hataları widget içinde gösterildiği için global hata toast'ı kapatılır.
 */
@Injectable({
  providedIn: 'root'
})
export class SupportChatService {

  apiUrl = 'https://localhost:44306/api/support/';

  constructor(private httpClient: HttpClient) { }

  sendMessage(request: SupportChatRequest): Observable<SingleResponseModel<SupportChatResponse>> {
    return this.httpClient.post<SingleResponseModel<SupportChatResponse>>(`${this.apiUrl}chat`, request, {
      context: new HttpContext().set(SKIP_GLOBAL_ERROR_TOAST, true)
    });
  }

  getArticles(): Observable<ListResponseModel<SupportArticle>> {
    return this.httpClient.get<ListResponseModel<SupportArticle>>(`${this.apiUrl}articles`);
  }
}
