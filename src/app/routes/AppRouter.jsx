import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { loadCategories, loadProducts } from '../../entities/product/model/productsSlice'
import { addToCartApi, refreshCart, setCartLineQuantity } from '../../features/cart/model/cartSlice'
import { selectEnrichedCartItems } from '../../features/cart/model/selectors'
import { loadOrders } from '../../features/orders/model/ordersSlice'
import Layout from '../../widgets/layout/ui/Layout'
import AboutPage from '../../pages/about/ui/AboutPage'
import AuthPage from '../../pages/auth/ui/AuthPage'
import CartPage from '../../pages/cart/ui/CartPage'
import CatalogPage from '../../pages/catalog/ui/CatalogPage'
import CheckoutPage from '../../pages/checkout/ui/CheckoutPage'
import ContactsPage from '../../pages/contacts/ui/ContactsPage'
import HomePage from '../../pages/home/ui/HomePage'
import NotFoundPage from '../../pages/not-found/ui/NotFoundPage'
import OrderSuccessPage from '../../pages/order-success/ui/OrderSuccessPage'
import ProductPage from '../../pages/product/ui/ProductPage'

function AppRouter() {
  const dispatch = useDispatch()
  const location = useLocation()
  const state = location.state
  const backgroundLocation = state?.backgroundLocation

  const products = useSelector((s) => s.products.items)
  const cartItems = useSelector(selectEnrichedCartItems)
  const cartTotal = useSelector((s) => s.cart.total)
  const lastOrder = useSelector((s) => s.orders.lastOrder)

  useEffect(() => {
    dispatch(loadCategories())
    dispatch(loadProducts({ page: 1, limit: 100 }))
    dispatch(refreshCart())
    dispatch(loadOrders())
  }, [dispatch])

  const addToCart = (product) => {
    dispatch(addToCartApi({ productId: product.id, quantity: 1 }))
  }

  const changeQuantity = (lineId, quantity) => {
    dispatch(setCartLineQuantity({ lineId, quantity }))
  }

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage products={products.slice(0, 8)} onAddToCart={addToCart} />} />
          <Route path="catalog" element={<CatalogPage products={products} onAddToCart={addToCart} />} />
          <Route path="product/:productId" element={<ProductPage onAddToCart={addToCart} />} />
          {!backgroundLocation ? <Route path="auth" element={<AuthPage />} /> : null}
          {!backgroundLocation ? (
            <Route
              path="cart"
              element={
                <CartPage
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  onChangeQuantity={changeQuantity}
                />
              }
            />
          ) : null}
          {!backgroundLocation ? (
            <Route path="checkout" element={<CheckoutPage cartItems={cartItems} total={cartTotal} />} />
          ) : null}
          {!backgroundLocation ? (
            <Route
              path="checkout/success"
              element={lastOrder ? <OrderSuccessPage /> : <Navigate to="/catalog" replace />}
            />
          ) : null}
          <Route path="about" element={<AboutPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {backgroundLocation ? (
        <Routes>
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                cartTotal={cartTotal}
                onChangeQuantity={changeQuantity}
              />
            }
          />
          <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} total={cartTotal} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/checkout/success"
            element={lastOrder ? <OrderSuccessPage /> : <Navigate to="/catalog" replace />}
          />
        </Routes>
      ) : null}
    </>
  )
}

export default AppRouter
