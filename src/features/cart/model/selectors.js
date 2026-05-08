export function selectEnrichedCartItems(state) {
  const raw = state.cart.rawItems
  const products = state.products.items
  const byId = new Map(products.map((p) => [p.id, p]))
  return raw.map((line) => {
    const p = byId.get(line.product_id)
    return {
      lineId: line.id,
      id: line.product_id,
      name: line.product_name,
      price: line.unit_price,
      quantity: line.quantity,
      stock: typeof p?.stock === 'number' ? p.stock : 10 ** 9,
      shortDescription: p?.shortDescription ?? '',
      imageUrl: p?.imageUrl ?? '',
    }
  })
}
