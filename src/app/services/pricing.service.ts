import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../models/car';
import { ListResponseModel } from '../models/listResponseModel';
import { PricingDecision, PricingPerformance } from '../models/pricing';

/**
 * RL fiyatlandırma uçları. Python servisine (8001) DOĞRUDAN gidilmez —
 * her şey backend üzerinden geçer, böylece JWT yetkilendirmesi ve CORS tek yerde kalır.
 */
@Injectable({
  providedIn: 'root'
})
export class PricingService {

  apiUrl = 'https://localhost:44306/api/cars/';

  constructor(private httpClient: HttpClient) { }

  /** Filo listesi (ham Car, CarDetail degil). */
  getCars(): Observable<ListResponseModel<Car>> {
    return this.httpClient.get<ListResponseModel<Car>>(this.apiUrl.slice(0, -1));
  }

  /** Tavsiye metni — fiyata dokunmaz. */
  getRecommendation(carId: number): Observable<{ carId: number; recommendedAction: string }> {
    return this.httpClient.get<{ carId: number; recommendedAction: string }>(
      `${this.apiUrl}${carId}/recommended-price`);
  }

  /** Tek aracın fiyatını RL kararıyla günceller. */
  updatePrice(carId: number): Observable<PricingDecision> {
    return this.httpClient.post<PricingDecision>(`${this.apiUrl}${carId}/update-price`, {});
  }

  /** Tüm filoyu tek turda fiyatlandırır. */
  updateAllPrices(): Observable<PricingDecision[]> {
    return this.httpClient.post<PricingDecision[]>(`${this.apiUrl}update-prices-batch`, {});
  }

  /** Penceresi dolmuş kararların ödülünü gerçekleşen kiralamalardan kapatır. */
  settleRewards(): Observable<{ settledDecisions: number }> {
    return this.httpClient.post<{ settledDecisions: number }>(
      `${this.apiUrl}settle-rewards`, {});
  }

  /** RL grubu vs kontrol grubu karşılaştırması. */
  getPerformance(lastDays: number = 30): Observable<PricingPerformance> {
    const params = new HttpParams().set('lastDays', lastDays);
    return this.httpClient.get<PricingPerformance>(
      `${this.apiUrl}pricing/performance`, { params });
  }
}
