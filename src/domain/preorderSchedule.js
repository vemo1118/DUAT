export function createPreorderWindow(opensAt) {
  const start = Date.parse(opensAt);
  if (!Number.isFinite(start)) throw new Error('A valid opening timestamp is required');
  const day = 24 * 60 * 60 * 1000;
  const iso = days => new Date(start + days * day).toISOString();
  return { opensAt: iso(0), closesAt: iso(7), productionStartsAt: iso(7), shipsFrom: iso(10), shipsBy: iso(12) };
}
