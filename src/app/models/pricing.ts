/** RL motorunun tek bir araç için verdiği fiyat kararı. */
export interface PricingDecision {
  carId: number;
  oldPrice: number;
  newPrice: number;
  /** Oransal aksiyon: -0.10 … +0.10 */
  action: number;
  reward: number;
  penalty: number;
  priceChange: string;
  stateKey: string;
}

export interface GroupPerformance {
  decisions: number;
  cars: number;
  realizedRentals: number;
  realizedRevenue: number;
  revenuePerDecision: number;
  averageReward: number;
}

/** RL grubu ile sabit fiyatlı kontrol grubunun karşılaştırması. */
export interface PricingPerformance {
  windowDays: number;
  rlGroup: GroupPerformance;
  controlGroup: GroupPerformance;
  upliftPercent: number | null;
  notes: string[];
}
