export function toNumber(value: string | number) {
  if (typeof value === 'number') return value
  const normalized = value.replace(',', '.')
  const parsed = Number(normalized)

  return Number.isNaN(parsed) ? 0 : parsed
}
