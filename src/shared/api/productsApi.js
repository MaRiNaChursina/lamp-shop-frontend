import { productApiBase } from './config'
import { parseJsonResponse } from './http'

export async function fetchCategories() {
  const res = await fetch(`${productApiBase}/api/v1/categories`)
  return parseJsonResponse(res)
}

export async function fetchProducts({ page = 1, limit = 100, categoryId, q = '', sort = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    q,
    sort,
  })
  if (categoryId) params.set('category_id', categoryId)
  const res = await fetch(`${productApiBase}/api/v1/products?${params}`)
  return parseJsonResponse(res)
}

export async function fetchProductById(productId) {
  const res = await fetch(`${productApiBase}/api/v1/products/${encodeURIComponent(productId)}`)
  return parseJsonResponse(res)
}
