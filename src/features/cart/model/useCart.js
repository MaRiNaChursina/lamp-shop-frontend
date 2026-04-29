import { useEffect, useMemo, useState } from 'react'

export function useCart() {
  const [cartItems, setCartItems] = useState([])
  const [lastOrder, setLastOrder] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  const cartItemsCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const selectedTotal = useMemo(() => {
    if (selectedIds.length === 0) return 0
    const ids = new Set(selectedIds)
    return cartItems.reduce((sum, item) => {
      if (!ids.has(item.id)) return sum
      return sum + item.price * item.quantity
    }, 0)
  }, [cartItems, selectedIds])

  // При добавлении/удалении товаров поддерживаем UX:
  // - если пользователь ещё не снимал выбор, выбираем все товары автоматически
  // - если выбор уже есть, просто чистим removed items
  useEffect(() => {
    setSelectedIds((prev) => {
      const cartIdSet = new Set(cartItems.map((i) => i.id))
      const kept = prev.filter((id) => cartIdSet.has(id))
      if (kept.length > 0) return kept
      if (prev.length === 0 && cartItems.length > 0) return cartItems.map((i) => i.id)
      return kept
    })
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        const rawMax = typeof existing.stock === 'number' ? existing.stock : product.stock
        const maxQty = typeof rawMax === 'number' && rawMax >= 1 ? rawMax : existing.quantity
        const nextQty = Math.min(existing.quantity + 1, maxQty)
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: nextQty } : item))
      }
      const maxQty = typeof product.stock === 'number' ? product.stock : 1
      if (maxQty < 1) return prev
      return [...prev, { ...product, quantity: 1 > maxQty ? maxQty : 1 }]
    })
  }

  const changeQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId))
      setSelectedIds((prev) => prev.filter((id) => id !== productId))
      return
    }

    setCartItems((prev) => {
      const item = prev.find((i) => i.id === productId)
      const maxQty = item && typeof item.stock === 'number' ? item.stock : quantity
      const nextQty = Math.min(quantity, maxQty)
      if (nextQty <= 0) return prev.filter((it) => it.id !== productId)
      return prev.map((it) => (it.id === productId ? { ...it, quantity: nextQty } : it))
    })
  }

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
    setSelectedIds((prev) => prev.filter((id) => id !== productId))
  }

  const toggleSelected = (productId) => {
    setSelectedIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const placeOrder = (delivery) => {
    const ids = selectedIds.length > 0 ? new Set(selectedIds) : new Set(cartItems.map((i) => i.id))
    const itemsToOrder = cartItems.filter((item) => ids.has(item.id))
    const totalToOrder = itemsToOrder.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: itemsToOrder,
      total: totalToOrder,
      delivery,
    }
    setLastOrder(order)
    setCartItems((prev) => prev.filter((item) => !ids.has(item.id)))
    setSelectedIds([])
    return order
  }

  return {
    cartItems,
    cartTotal,
    selectedIds,
    selectedTotal,
    cartItemsCount,
    lastOrder,
    addToCart,
    changeQuantity,
    removeFromCart,
    toggleSelected,
    placeOrder,
  }
}
