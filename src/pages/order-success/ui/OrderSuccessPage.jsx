import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './OrderSuccessPage.module.scss'

function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const order = useSelector((s) => s.orders.lastOrder)

  const closeModal = () => {
    const backgroundLocation = location.state?.backgroundLocation
    if (backgroundLocation?.pathname) {
      navigate(
        {
          pathname: backgroundLocation.pathname,
          search: backgroundLocation.search ?? '',
          hash: backgroundLocation.hash ?? '',
        },
        { replace: true },
      )
      return
    }
    navigate('/catalog', { replace: true })
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

        <div className={styles.modalSuccessBody}>
          <div className={styles.modalSuccessText}>
            Заказ оформлен
            {order?.order_number ? (
              <>
                <br />
                Номер: {order.order_number}
              </>
            ) : null}
            {order?.total_amount != null ? (
              <>
                <br />
                Сумма: {order.total_amount} ₽
              </>
            ) : null}
            <br />
            Доставка в течение 5 дней
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
