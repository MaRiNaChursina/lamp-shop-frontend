import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '../../../shared/api/http'
import * as orderApi from '../../../shared/api/orderServiceApi'
import { getOrCreateSessionId } from '../../../shared/lib/session'
import { loadProducts } from '../../../entities/product/model/productsSlice'
import { refreshCart } from '../../cart/model/cartSlice'

function orderErrorMessage(e) {
  return e instanceof ApiError ? e.message : String(e)
}

export const loadOrders = createAsyncThunk('orders/load', async (_, { rejectWithValue }) => {
  try {
    const sid = getOrCreateSessionId()
    return await orderApi.fetchOrders(sid, { page: 1, limit: 50 })
  } catch (e) {
    return rejectWithValue(orderErrorMessage(e))
  }
})

export const submitOrder = createAsyncThunk(
  'orders/submit',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const sid = getOrCreateSessionId()
      const order = await orderApi.createOrder(sid, body)
      await dispatch(refreshCart()).unwrap()
      await dispatch(loadProducts({ page: 1, limit: 100 })).unwrap()
      return order
    } catch (e) {
      if (typeof e === 'string') return rejectWithValue(e)
      if (e instanceof ApiError) return rejectWithValue(e.message)
      return rejectWithValue(orderErrorMessage(e))
    }
  },
)

const initialState = {
  items: [],
  lastOrder: null,
  listStatus: 'idle',
  submitStatus: 'idle',
  error: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadOrders.pending, (state) => {
        state.listStatus = 'loading'
        state.error = null
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.listStatus = 'succeeded'
        const rows = action.payload?.data
        state.items = Array.isArray(rows) ? rows : []
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.listStatus = 'failed'
        state.error = action.payload || 'Не удалось загрузить заказы'
      })
      .addCase(submitOrder.pending, (state) => {
        state.submitStatus = 'loading'
        state.error = null
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded'
        state.lastOrder = action.payload
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.submitStatus = 'failed'
        state.error = action.payload || 'Не удалось оформить заказ'
      })
  },
})

export const { clearOrderError } = ordersSlice.actions
export default ordersSlice.reducer
