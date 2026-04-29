import { useLocation, useNavigate } from 'react-router-dom'
import styles from './OrderSuccessPage.module.scss'

function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
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

        <div className={styles.modalSuccessBody}>
          <div className={styles.modalSuccessText}>
            Заказ оформлен. Доставка
            <br />
            в течении 5 дней
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
