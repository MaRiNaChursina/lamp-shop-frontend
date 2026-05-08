import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../entities/product/model/productsSlice'
import cartReducer from '../features/cart/model/cartSlice'
import ordersReducer from '../features/orders/model/ordersSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
})
