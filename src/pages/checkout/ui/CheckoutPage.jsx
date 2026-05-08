import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { clearOrderError, submitOrder } from '../../../features/orders/model/ordersSlice'
import styles from './CheckoutPage.module.scss'

function deliveryAddressPayload(deliveryKey) {
  if (deliveryKey === 'store') {
    return {
      city: 'Москва',
      street: 'Самовывоз из магазина',
      building: '1',
      apartment: null,
      postal_code: '101000',
    }
  }
  if (deliveryKey === 'address') {
    return {
      city: 'Москва',
      street: 'ул. Домостроителей',
      building: '10',
      apartment: '103',
      postal_code: '115487',
    }
  }
  return {
    city: 'Москва',
    street: 'ул. Уточняется менеджером',
    building: '1',
    apartment: '1',
    postal_code: '101000',
  }
}

function CheckoutPage({ cartItems, total }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [delivery, setDelivery] = useState('store')
  const submitStatus = useSelector((s) => s.orders.submitStatus)
  const submitError = useSelector((s) => s.orders.error)

  const deliveryLabel = useMemo(() => {
    if (delivery === 'store') return 'Самовывоз с магазина'
    if (delivery === 'address') return 'ул. Домостроителей, 10 кв. 103'
    return 'Добавить новый адрес'
  }, [delivery])

  const closeModal = () => {
    if (location.state?.backgroundLocation) {
      navigate(-1)
      return
    }
    navigate('/catalog')
  }

  useEffect(() => {
    dispatch(clearOrderError())
  }, [dispatch])

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

  const onOrder = async () => {
    try {
      await dispatch(
        submitOrder({
          delivery_address: deliveryAddressPayload(delivery),
          payment_method: paymentMethod,
          notes: `Доставка (UI): ${deliveryLabel}`,
        }),
      ).unwrap()
      navigate('/checkout/success', { state: { backgroundLocation: location.state?.backgroundLocation ?? location } })
    } catch {
      // ошибка уже в store
    }
  }

  const canOrder = total > 0 && submitStatus !== 'loading'

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

        {submitError ? (
          <div className={styles.checkoutDeliveryNote} role="alert">{submitError}</div>
        ) : null}

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
            {submitStatus === 'loading' ? 'Отправка…' : 'Заказать'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
