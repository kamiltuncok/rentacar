/** Kaydedilmiş bir fiyat kararı. Ödül karar anında değil, gözlem penceresi dolunca hesaplanır. */
export interface PricingDecision {
  decisionId: number;
  carId: number;
  oldPrice: number;
  newPrice: number;
  /** Oransal aksiyon: -0.10 … +0.10 (kontrol grubunda 0) */
  action: number;
  priceChange: string;
  /** "SEGMENT|TALEP|FIYAT|TREND|ATALET|MEVSIM" veya kontrol grubunda "CONTROL" */
  stateKey: string;
  isControlGroup: boolean;
  isExploration: boolean;
  /** Ödülün hesaplanacağı an; o zamana kadar araca yeni karar verilmez. */
  windowEndsAt: string;
}

export interface SettlementSummary {
  settledDecisions: number;
  learnedDecisions: number;
  duplicateDecisions: number;
  controlDecisions: number;
  excludedDecisions: number;
  deferred: number;
  epsilon: number | null;
}

export interface GroupPerformance {
  decisions: number;
  cars: number;
  realizedRentals: number;
  cancelledRentals: number;
  cancellationRate: number;
  /** Net ciro (iptal/iade düşülmüş) */
  realizedRevenue: number;
  revenuePerDecision: number;
  /** Araç başına net ciro / gözlenen gün — temel karşılaştırma metriği */
  revenuePerCarDay: number;
  standardError: number;
  averageReward: number | null;
}

export interface SegmentPerformance {
  segmentId: number;
  rlGroup: GroupPerformance;
  controlGroup: GroupPerformance;
  differencePerCarDay: number | null;
  upliftPercent: number | null;
}

/** RL grubu ile sabit fiyatlı kontrol grubunun segment ağırlıklı karşılaştırması. */
export interface PricingPerformance {
  windowDays: number;
  rlGroup: GroupPerformance;
  controlGroup: GroupPerformance;
  upliftPercent: number | null;
  differencePerCarDay: number | null;
  differenceCi95Low: number | null;
  differenceCi95High: number | null;
  isSignificant: boolean;
  segments: SegmentPerformance[];
  notes: string[];
}
