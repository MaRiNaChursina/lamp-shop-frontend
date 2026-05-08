import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '../../../shared/api/http'
import * as orderApi from '../../../shared/api/orderServiceApi'
import { getOrCreateSessionId } from '../../../shared/lib/session'

function cartErrorMessage(e) {
  return e instanceof ApiError ? e.message : String(e)
}

export const refreshCart = createAsyncThunk('cart/refresh', async (_, { rejectWithValue }) => {
  try {
    const sid = getOrCreateSessionId()
    return await orderApi.fetchCart(sid)
  } catch (e) {
    return rejectWithValue(cartErrorMessage(e))
  }
})

export const addToCartApi = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const sid = getOrCreateSessionId()
      await orderApi.addCartItem(sid, productId, quantity)
      return await orderApi.fetchCart(sid)
    } catch (e) {
      return rejectWithValue(cartErrorMessage(e))
    }
  },
)

export const setCartLineQuantity = createAsyncThunk(
  'cart/setLineQuantity',
  async ({ lineId, quantity }, { rejectWithValue }) => {
    try {
      const sid = getOrCreateSessionId()
      if (quantity <= 0) {
        await orderApi.deleteCartItem(sid, lineId)
      } else {
        await orderApi.updateCartItem(sid, lineId, quantity)
      }
      return await orderApi.fetchCart(sid)
    } catch (e) {
      return rejectWithValue(cartErrorMessage(e))
    }
  },
)

const initialState = {
  rawItems: [],
  total: 0,
  itemsCount: 0,
  status: 'idle',
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers(builder) {
    const applyCartPayload = (state, payload) => {
      if (!payload || typeof payload !== 'object') return
      state.rawItems = Array.isArray(payload.items) ? payload.items : []
      state.total = typeof payload.total === 'number' ? payload.total : 0
      state.itemsCount = typeof payload.items_count === 'number' ? payload.items_count : 0
    }

    builder
      .addCase(refreshCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(refreshCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        applyCartPayload(state, action.payload)
      })
      .addCase(refreshCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Не удалось загрузить корзину'
      })
      .addCase(addToCartApi.pending, (state) => {
        state.error = null
      })
      .addCase(addToCartApi.fulfilled, (state, action) => {
        state.status = 'succeeded'
        applyCartPayload(state, action.payload)
      })
      .addCase(addToCartApi.rejected, (state, action) => {
        state.error = action.payload || 'Не удалось добавить в корзину'
      })
      .addCase(setCartLineQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded'
        applyCartPayload(state, action.payload)
      })
      .addCase(setCartLineQuantity.rejected, (state, action) => {
        state.error = action.payload || 'Не удалось обновить корзину'
      })
  },
})

export default cartSlice.reducer
