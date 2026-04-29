import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './AuthPage.module.scss'

function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('form')
  const [role, setRole] = useState('client')

  const onSubmit = (event) => {
    event.preventDefault()

    const normalizedLogin = login.trim().toLowerCase()
    const nextRole = normalizedLogin === 'admin' ? 'admin' : 'client'

    try {
      localStorage.setItem('lampshop_auth', '1')
      localStorage.setItem('lampshop_role', nextRole)
      localStorage.setItem('lampshop_user_name', login.trim() || 'Имя')
    } catch {
      // ignore storage errors
    }

    setRole(nextRole)
    setStatus('success')
  }

  const userName = login.trim() || 'Имя'
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
          <h1 className={styles.modalTitle}>Авторизация</h1>
          <div className={styles.modalDivider} />
        </div>

        {status === 'form' ? (
          <form className={styles.authForm} onSubmit={onSubmit}>
            <label className={styles.authField}>
              <span>Логин:</span>
              <input value={login} onChange={(e) => setLogin(e.target.value)} required />
            </label>

            <label className={styles.authField}>
              <span>Пароль:</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button className={`${styles.primaryBtn} ${styles.authSubmit}`} type="submit">
              Войти
            </button>
          </form>
        ) : (
          <div className={styles.authSuccess}>
            <div className={styles.authSuccessTitle}>Успешная авторизация!</div>
            <div className={styles.authSuccessText}>Рады Вас видеть, {userName}!</div>

            {role === 'admin' ? (
              <button className={`${styles.primaryBtn} ${styles.authAdminBtn}`} type="button">
                Войти в админ панель
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage
