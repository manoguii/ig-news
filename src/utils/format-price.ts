export function formatPrice() {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  })
}
