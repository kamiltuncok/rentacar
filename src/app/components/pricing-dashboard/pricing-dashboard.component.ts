import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Car } from '../../models/car';
import { PricingDecision, PricingPerformance } from '../../models/pricing';
import { PricingService } from '../../services/pricing.service';

@Component({
  selector: 'app-pricing-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pricing-dashboard.component.html',
  styleUrls: ['./pricing-dashboard.component.css']
})
export class PricingDashboardComponent implements OnInit {

  cars: Car[] = [];
  decisions: PricingDecision[] = [];
  performance: PricingPerformance | null = null;

  /** carId -> tavsiye metni */
  recommendations: { [carId: number]: string } = {};

  windowDays = 30;
  loadingPerformance = false;
  runningBatch = false;
  settling = false;
  updatingCarId: number | null = null;

  constructor(
    private pricingService: PricingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCars();
    this.loadPerformance();
  }

  loadCars(): void {
    this.pricingService.getCars().subscribe({
      next: response => this.cars = response.data ?? [],
      error: () => this.toastr.error('Araçlar yüklenemedi')
    });
  }

  loadPerformance(): void {
    this.loadingPerformance = true;
    this.pricingService.getPerformance(this.windowDays).subscribe({
      next: result => {
        this.performance = result;
        this.loadingPerformance = false;
      },
      error: () => {
        this.toastr.error('Performans raporu alınamadı');
        this.loadingPerformance = false;
      }
    });
  }

  runBatch(): void {
    this.runningBatch = true;
    this.pricingService.updateAllPrices().subscribe({
      next: results => {
        this.decisions = results;
        this.runningBatch = false;
        this.toastr.success(`${results.length} araç fiyatlandırıldı`);
        this.loadCars();
      },
      error: () => {
        this.toastr.error('Toplu fiyatlandırma başarısız');
        this.runningBatch = false;
      }
    });
  }

  settleRewards(): void {
    this.settling = true;
    this.pricingService.settleRewards().subscribe({
      next: result => {
        this.settling = false;
        this.toastr.success(
          `${result.settledDecisions} karar kapatıldı · ${result.learnedDecisions} öğrenildi · ` +
          `${result.controlDecisions} kontrol · ${result.excludedDecisions} hariç`);
        this.loadPerformance();
      },
      error: () => {
        this.toastr.error('Ödül kapatma başarısız');
        this.settling = false;
      }
    });
  }

  updateOne(carId: number): void {
    this.updatingCarId = carId;
    this.pricingService.updatePrice(carId).subscribe({
      next: decision => {
        this.decisions = [decision, ...this.decisions.filter(d => d.carId !== carId)];
        this.updatingCarId = null;
        this.toastr.success(`Araç ${carId}: ${decision.oldPrice} → ${decision.newPrice} TL`);
        this.loadCars();
      },
      error: err => {
        // 409: aracın önceki kararının gözlem penceresi henüz kapanmadı
        this.toastr.error(err?.error?.message ?? 'Fiyat güncellenemedi');
        this.updatingCarId = null;
      }
    });
  }

  askRecommendation(carId: number): void {
    this.pricingService.getRecommendation(carId).subscribe({
      next: result => this.recommendations[carId] = result.recommendedAction,
      error: () => this.toastr.error('Tavsiye alınamadı')
    });
  }

  /** Karar tablosunda satırı renklendirmek için. */
  actionClass(action: number): string {
    if (action > 0) return 'action-up';
    if (action < 0) return 'action-down';
    return 'action-flat';
  }

  decisionKind(d: PricingDecision): string {
    if (d.isControlGroup) return 'Kontrol';
    return d.isExploration ? 'RL (keşif)' : 'RL';
  }

  /** State anahtarını okunur parçalara böler: SEGMENT|TALEP|FIYAT|TREND|ATALET|MEVSIM */
  explainState(stateKey: string): string {
    if (!stateKey || stateKey === 'CONTROL') return 'Kontrol grubu (fiyat sabit, RL kararı yok)';
    const tr: { [k: string]: string } = {
      LOW: 'Düşük', MID: 'Orta', HIGH: 'Yüksek',
      RISING: 'Yükseliyor', FALLING: 'Düşüyor', STABLE: 'Sabit',
      HIGH_SEASON: 'Yüksek sezon', MID_SEASON: 'Orta sezon', LOW_SEASON: 'Düşük sezon'
    };
    const parts = stateKey.split('|');
    if (parts.length !== 6) return stateKey;
    const [segment, demand, price, trend, inertia, season] = parts;
    return `Segment ${segment} · `
      + `Talep: ${tr[demand] ?? demand} · `
      + `Fiyat: ${tr[price] ?? price} · `
      + `Trend: ${tr[trend] ?? trend} · `
      + `Atalet: ${inertia} · `
      + `${tr[season] ?? season}`;
  }

  get ciLabel(): string {
    const p = this.performance;
    if (p?.differenceCi95Low == null || p?.differenceCi95High == null) return '';
    return `%95 GA: ${p.differenceCi95Low.toFixed(0)} … ${p.differenceCi95High.toFixed(0)} ₺/araç-gün`;
  }

  get upliftLabel(): string {
    const uplift = this.performance?.upliftPercent;
    if (uplift === null || uplift === undefined) return '—';
    return `${uplift > 0 ? '+' : ''}${uplift.toFixed(1)}%`;
  }

  get upliftClass(): string {
    const uplift = this.performance?.upliftPercent;
    if (uplift === null || uplift === undefined) return 'action-flat';
    return uplift > 0 ? 'action-up' : uplift < 0 ? 'action-down' : 'action-flat';
  }
}
