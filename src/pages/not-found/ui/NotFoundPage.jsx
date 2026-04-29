import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.scss'

function NotFoundPage() {
  return (
    <section className={styles.emptyState}>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/" className={styles.homeBtn}>На главную</Link>
    </section>
  )
}

export default NotFoundPage
