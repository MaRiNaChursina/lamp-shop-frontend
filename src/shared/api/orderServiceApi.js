import { orderApiBase } from './config'
import { jsonHeaders, orderServiceHeaders, parseJsonResponse } from './http'

export async function fetchCart(sessionId) {
  const res = await fetch(`${orderApiBase}/api/v1/cart`, {
    headers: orderServiceHeaders(sessionId),
  })
  return parseJsonResponse(res)
}

export async function addCartItem(sessionId, productId, quantity = 1) {
  const res = await fetch(`${orderApiBase}/api/v1/cart/items`, {
    method: 'POST',
    headers: jsonHeaders(sessionId),
    body: JSON.stringify({ product_id: productId, quantity }),
  })
  return parseJsonResponse(res)
}

export async function updateCartItem(sessionId, itemId, quantity) {
  const res = await fetch(`${orderApiBase}/api/v1/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'PUT',
    headers: jsonHeaders(sessionId),
    body: JSON.stringify({ quantity }),
  })
  return parseJsonResponse(res)
}

export async function deleteCartItem(sessionId, itemId) {
  const res = await fetch(`${orderApiBase}/api/v1/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
    headers: orderServiceHeaders(sessionId),
  })
  return parseJsonResponse(res)
}

export async function createOrder(sessionId, body) {
  const res = await fetch(`${orderApiBase}/api/v1/orders`, {
    method: 'POST',
    headers: jsonHeaders(sessionId),
    body: JSON.stringify(body),
  })
  return parseJsonResponse(res)
}

export async function fetchOrders(sessionId, { page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  const res = await fetch(`${orderApiBase}/api/v1/orders?${params}`, {
    headers: orderServiceHeaders(sessionId),
  })
  return parseJsonResponse(res)
}
