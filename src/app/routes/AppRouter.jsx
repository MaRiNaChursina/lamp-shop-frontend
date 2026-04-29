import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PRODUCTS } from '../../entities/product/model/products'
import { useCart } from '../../features/cart/model/useCart'
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
  const location = useLocation()
  const state = location.state
  const backgroundLocation = state?.backgroundLocation

  const {
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
  } = useCart()

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Layout cartItemsCount={cartItemsCount} />}>
          <Route index element={<HomePage products={PRODUCTS.slice(0, 8)} onAddToCart={addToCart} />} />
          <Route path="catalog" element={<CatalogPage products={PRODUCTS} onAddToCart={addToCart} />} />
          <Route path="product/:productId" element={<ProductPage products={PRODUCTS} onAddToCart={addToCart} />} />
          {!backgroundLocation ? <Route path="auth" element={<AuthPage />} /> : null}
          {!backgroundLocation ? (
            <Route
              path="cart"
              element={
                <CartPage
                  cartItems={cartItems}
                  total={cartTotal}
                  selectedIds={selectedIds}
                  selectedTotal={selectedTotal}
                  onChangeQuantity={changeQuantity}
                  onRemoveItem={removeFromCart}
                  onToggleSelected={toggleSelected}
                />
              }
            />
          ) : null}
          {!backgroundLocation ? (
            <Route
              path="checkout"
              element={<CheckoutPage cartItems={cartItems} total={selectedTotal} selectedIds={selectedIds} onPlaceOrder={placeOrder} />}
            />
          ) : null}
          {!backgroundLocation ? (
            <Route
              path="checkout/success"
              element={lastOrder ? <OrderSuccessPage order={lastOrder} /> : <Navigate to="/catalog" replace />}
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
                total={cartTotal}
                selectedIds={selectedIds}
                selectedTotal={selectedTotal}
                onChangeQuantity={changeQuantity}
                onRemoveItem={removeFromCart}
                onToggleSelected={toggleSelected}
              />
            }
          />
          <Route
            path="/checkout"
            element={<CheckoutPage cartItems={cartItems} total={selectedTotal} selectedIds={selectedIds} onPlaceOrder={placeOrder} />}
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/checkout/success"
            element={lastOrder ? <OrderSuccessPage order={lastOrder} /> : <Navigate to="/catalog" replace />}
          />
        </Routes>
      ) : null}
    </>
  )
}

export default AppRouter
