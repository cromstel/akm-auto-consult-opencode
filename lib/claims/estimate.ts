export function calculateEstimate(baseCostCents: number, vatRate = 0.15, nhilRate = 0.05, depreciation = 0.10) {
  // M6 — DECIMAL (integer minor units only), never float
  const vat = Math.round(baseCostCents * vatRate);
  const nhil = Math.round(baseCostCents * nhilRate);
  const depreciationAmount = Math.round(baseCostCents * depreciation);
  const total = baseCostCents + vat + nhil - depreciationAmount;
  return { base: baseCostCents, vat, nhil, depreciation: depreciationAmount, total };
}
