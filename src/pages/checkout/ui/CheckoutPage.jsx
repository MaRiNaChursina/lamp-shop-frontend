import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './CheckoutPage.module.scss'

function CheckoutPage({ cartItems, total, selectedIds, onPlaceOrder }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [delivery, setDelivery] = useState('store')

  const deliveryLabel = useMemo(() => {
    if (delivery === 'store') return 'Самовывоз с магазина'
    if (delivery === 'address') return 'ул. Домостроителей, 10 кв. 103'
    return 'Добавить новый адрес'
  }, [delivery])

  if (cartItems.length === 0) {
    return (
      <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
        <div className={styles.modalDialog}>
          <button className={styles.modalClose} type="button" aria-label="Закрыть" onClick={closeModal}>
            ×
          </button>
          <div className={styles.modalTitleRow}>
            <h1 className={styles.modalTitle}>Оплата</h1>
            <div className={styles.modalDivider} />
          </div>
          <div className={styles.modalEmpty}>Нельзя оформить пустой заказ</div>
        </div>
      </div>
    )
  }

  const methods = [
    { id: 'card', label: 'Карта' },
    { id: 'sbp', label: 'Система быстрых платежей' },
    { id: 'cash', label: 'Наличными' },
  ]

  const deliveryOptions = [
    { id: 'store', label: 'Самовывоз с магазина' },
    { id: 'address', label: 'ул. Домостроителей, 10 кв. 103' },
    { id: 'new', label: 'Добавить новый адрес' },
  ]

  const onOrder = () => {
    onPlaceOrder({ delivery: deliveryLabel, payment: paymentMethod })
    navigate('/checkout/success', { state: { backgroundLocation: location.state?.backgroundLocation ?? location } })
  }

  const canOrder = total > 0 && selectedIds && selectedIds.length > 0
  const closeModal = () => {
    if (location.state?.backgroundLocation) {
      navigate(-1)
      return
    }
    navigate('/catalog')
  }

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modalDialog}>
        <button className={styles.modalClose} type="button" aria-label="Закрыть" onClick={closeModal}>
          ×
        </button>

        <div className={styles.modalTitleRow}>
          <h1 className={styles.modalTitle}>Оплата</h1>
          <div className={styles.modalDivider} />
        </div>

        <div className={styles.checkoutBody}>
          <div>
            <div className={styles.checkoutSectionTitle}>Способ оплаты</div>
            <div className={styles.paymentMethods}>
              {methods.map((m) => (
                <label key={m.id} className={styles.paymentMethod}>
                  <input
                    className={styles.srOnly}
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    aria-label={m.label}
                  />

                  <div className={styles.paymentMethodThumb} aria-hidden="true">
                    <div className={styles.paymentRadioDot} aria-hidden="true">
                      {paymentMethod === m.id ? <span className={styles.paymentRadioDotInner} /> : null}
                    </div>
                  </div>

                  <div className={styles.paymentMethodLabel} aria-hidden="true">
                    {m.id === 'cash' ? 'Наличными' : m.id === 'sbp' ? 'СПБ' : 'Карта'}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.checkoutSectionTitle}>Доставка</div>
            <div className={styles.deliveryOptions}>
              {deliveryOptions.map((opt) => (
                <label key={opt.id} className={styles.deliveryOption}>
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.id}
                    checked={delivery === opt.id}
                    onChange={() => setDelivery(opt.id)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            <div className={styles.checkoutDeliveryNote}>Доставка в течение 5 дней</div>
          </div>
        </div>

        <div className={styles.checkoutFooter}>
          <div className={styles.checkoutTotal}>Итог: {total} ₽</div>
          <button
            className={styles.checkoutOrderBtn}
            type="button"
            onClick={onOrder}
            disabled={!canOrder}
          >
            Заказать
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
