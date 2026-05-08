export function mapProductListRow(row) {
  const desc = row?.name ? String(row.name) : ''
  return {
    id: row.id,
    categoryId: row.category?.id,
    name: row.name,
    price: row.price,
    stock: row.stock_quantity,
    sku: row.sku,
    powerWatts: row.power_watts,
    baseType: row.base_type,
    colorTempK: row.color_temp_k,
    imageUrl: row.primary_image || '',
    shortDescription: desc.length > 90 ? `${desc.slice(0, 87)}…` : desc,
    rating: 4.5,
    oldPrice: row.price != null ? Math.round(Number(row.price) * 1.12) : null,
  }
}

export function mapProductDetail(p) {
  const imgs = Array.isArray(p?.images) ? p.images : []
  const primary = imgs.find((i) => i.is_primary)?.url || imgs[0]?.url || ''
  return {
    id: p.id,
    categoryId: p.category?.id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    stock: p.stock_quantity,
    powerWatts: p.power_watts,
    baseType: p.base_type,
    colorTempK: p.color_temp_k,
    imageUrl: primary,
    rating: 4.6,
    oldPrice: p.price != null ? Math.round(Number(p.price) * 1.12) : null,
  }
}
