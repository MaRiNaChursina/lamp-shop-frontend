import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '../../../shared/api/http'
import * as productsApi from '../../../shared/api/productsApi'
import { mapProductDetail, mapProductListRow } from '../../../shared/lib/productMappers'

export const loadCategories = createAsyncThunk('products/loadCategories', async (_, { rejectWithValue }) => {
  try {
    return await productsApi.fetchCategories()
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : String(e)
    return rejectWithValue(msg)
  }
})

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await productsApi.fetchProducts(params)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e)
      return rejectWithValue(msg)
    }
  },
)

export const loadProductDetail = createAsyncThunk(
  'products/loadProductDetail',
  async (productId, { rejectWithValue }) => {
    try {
      return await productsApi.fetchProductById(productId)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e)
      return rejectWithValue(msg)
    }
  },
)

const initialState = {
  categories: [],
  items: [],
  detail: null,
  detailId: null,
  listStatus: 'idle',
  categoriesStatus: 'idle',
  detailStatus: 'idle',
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductDetail(state) {
      state.detail = null
      state.detailId = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.categoriesStatus = 'loading'
        state.error = null
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded'
        state.categories = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed'
        state.error = action.payload || 'Не удалось загрузить категории'
      })
      .addCase(loadProducts.pending, (state) => {
        state.listStatus = 'loading'
        state.error = null
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.listStatus = 'succeeded'
        const rows = action.payload?.data
        state.items = Array.isArray(rows) ? rows.map(mapProductListRow) : []
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.listStatus = 'failed'
        state.error = action.payload || 'Не удалось загрузить товары'
      })
      .addCase(loadProductDetail.pending, (state) => {
        state.detailStatus = 'loading'
        state.error = null
      })
      .addCase(loadProductDetail.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.detail = mapProductDetail(action.payload)
        state.detailId = state.detail?.id ?? null
      })
      .addCase(loadProductDetail.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.detail = null
        state.detailId = null
        state.error = action.payload || 'Не удалось загрузить товар'
      })
  },
})

export const { clearProductDetail } = productsSlice.actions
export default productsSlice.reducer
