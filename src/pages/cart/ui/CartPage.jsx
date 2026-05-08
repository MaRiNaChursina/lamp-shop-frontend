import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './CartPage.module.scss'

function useAuthFromStorage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('lampshop_auth') === '1'
    } catch {
      return false
    }
  })

  return { isAuthenticated, setIsAuthenticated }
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem('lampshop_favorites')
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function CartPage({ cartItems, cartTotal, onChangeQuantity }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, setIsAuthenticated } = useAuthFromStorage()
  const cartError = useSelector((s) => s.cart.error)

  const [favoriteIds, setFavoriteIds] = useState(() => new Set(loadFavorites()))

  useEffect(() => {
    setFavoriteIds(new Set(loadFavorites()))
  }, [])

  useEffect(() => {
    try {
      setIsAuthenticated(localStorage.getItem('lampshop_auth') === '1')
    } catch {
      setIsAuthenticated(false)
    }
  }, [location.pathname, setIsAuthenticated])

  const toggleFavorite = (productId) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      try {
        localStorage.setItem('lampshop_favorites', JSON.stringify(Array.from(next)))
      } catch {
        // ignore
      }
      return next
    })
  }

  const canOrder = isAuthenticated && cartTotal > 0
  const closeModal = () => {
    if (location.state?.backgroundLocation) {
      navigate(-1)
      return
    }
    navigate('/catalog')
  }

  const modalBackground = location.state?.backgroundLocation ?? location

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modalDialog}>
        <button className={styles.modalClose} type="button" aria-label="Закрыть" onClick={closeModal}>
          ×
        </button>

        <div className={styles.modalTitleRow}>
          <h1 className={styles.modalTitle}>Корзина</h1>
          <div className={styles.modalDivider} />
        </div>

        {cartError ? (
          <div className={styles.modalAuthNote} role="alert">{cartError}</div>
        ) : null}

        {cartItems.length > 0 ? (
          <div className={styles.modalCartItems}>
            {cartItems.map((item) => {
              const itemTotal = item.price * item.quantity
              const isFav = favoriteIds.has(item.id)

              return (
                <article className={styles.modalCartItem} key={item.lineId}>
                  <div className={styles.modalThumb} aria-hidden="true">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" decoding="async" /> : null}
                  </div>

                  <div className={styles.modalCartItemText}>
                    <div className={styles.modalCartItemName}>{item.name || 'название товара'}</div>
                    <div className={styles.modalCartItemDesc}>
                      {item.shortDescription || 'короткое описание короткое описание'}
                    </div>

                    <div className={styles.modalCartItemPriceBlock}>
                      <div className={styles.modalCartItemUnit}>{item.price || 0} ₽</div>
                      <div className={styles.modalCartItemTotal}>
                        Итого: {itemTotal} ₽
                      </div>
                    </div>
                  </div>

                  <div className={styles.modalCartItemActions}>
                    <button
                      type="button"
                      className={`${styles.modalHeartBtn} ${isFav ? styles.modalHeartBtnOn : ''}`}
                      aria-label="В избранное"
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12.1 20.2s-7-4.5-9.2-8.6C1.4 8.2 3.1 5.7 5.8 5.1c1.6-.4 3.2.2 4.2 1.4 1-1.2 2.6-1.8 4.2-1.4 2.7.6 4.4 3.1 2.9 6.5-2.2 4.1-9 8.6-9 8.6z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div className={styles.modalQty} aria-label="Количество">
                      <button
                        type="button"
                        className={styles.modalQtyBtn}
                        aria-label="Уменьшить"
                        disabled={item.quantity <= 1}
                        onClick={() => onChangeQuantity(item.lineId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <div className={styles.modalQtyValue}>{item.quantity}</div>
                      <button
                        type="button"
                        className={styles.modalQtyBtn}
                        aria-label="Увеличить"
                        disabled={typeof item.stock === 'number' ? item.quantity >= item.stock : false}
                        onClick={() => onChangeQuantity(item.lineId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className={styles.modalEmpty}>Корзина пуста</div>
        )}

        <div className={styles.modalFooter}>
          {!isAuthenticated ? (
            <div className={styles.modalAuthNote}>Для заказа необходимо авторизоваться</div>
          ) : null}

          <div className={styles.modalTotal}>Итог: {cartTotal} ₽</div>

          {isAuthenticated ? (
            <button
              className={styles.modalPrimaryBtn}
              type="button"
              onClick={() => navigate('/checkout', { state: { backgroundLocation: modalBackground } })}
              disabled={!canOrder}
            >
              Заказать
            </button>
          ) : (
            <div className={styles.modalActions}>
              <button className={`${styles.modalPrimaryBtn} ${styles.modalPrimaryBtnDisabled}`} type="button" disabled>
                Заказать
              </button>
              <button
                className={styles.modalPrimaryBtn}
                type="button"
                onClick={() => navigate('/auth', { state: { backgroundLocation: modalBackground } })}
              >
                Войти
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartPage
