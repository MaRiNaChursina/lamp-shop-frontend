import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import styles from './Layout.module.scss'

function Layout() {
  const cartItemsCount = useSelector((s) => s.cart.itemsCount)
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navLinkClass = ({ isActive }) => `${styles.menuLink} ${isActive ? styles.active : ''}`
  const menuClassName = `${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <div className={styles.appShell}>
      <header className={styles.siteHeader}>
        <div className={`container ${styles.headerInner}`}>
          <NavLink to="/" className={styles.logo}>
            LampShop
          </NavLink>

          <button
            type="button"
            className={`${styles.burgerBtn} ${isMenuOpen ? styles.burgerBtnOpen : ''}`}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            aria-controls="site-navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav id="site-navigation" className={menuClassName}>
            <NavLink to="/catalog" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Каталог</NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>О нас</NavLink>
            <NavLink to="/contacts" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Контакты</NavLink>
          </nav>
          <NavLink
            to="/cart"
            state={{ backgroundLocation: location }}
            className={({ isActive }) => `${styles.cartBtn} ${styles.cartIcon} ${isActive ? styles.active : ''}`}
            aria-label={`Корзина (${cartItemsCount})`}
            title={`Корзина (${cartItemsCount})`}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6.5 6h14l-1.2 6.1a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.6L5.6 3.8A1.5 1.5 0 0 0 4.1 2.5H2.5"
                stroke="#0b66ff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.2 20.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM17.2 20.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z"
                fill="#0b66ff"
              />
            </svg>
            {cartItemsCount > 0 ? <span className={styles.cartBadge}>{cartItemsCount}</span> : null}
          </NavLink>
        </div>
      </header>
      <main className={`container ${styles.pageContent}`}><Outlet /></main>
      <footer className={styles.siteFooter}>
        <div className={`container ${styles.footerGrid}`}>
          <div className={styles.footerCol}>
            <div className={styles.footerAboutText}>
              Информация о компании, чем
              занимаемся и еще немного
              текста
            </div>
            <div className={styles.footerLogo} aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2c4.5 0 8 3.5 8 8 0 4.2-3 7.6-7 7.9V21h-2v-3.1c-4-.3-7-3.7-7-7.9 0-4.5 3.5-8 8-8z"
                  stroke="#0b66ff"
                  strokeWidth="1.7"
                />
                <path
                  d="M7 9.5h10"
                  stroke="#0b66ff"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerLinksTitle}>Главная</div>
            <div className={styles.footerLinks}>
              <a href="/">Главная</a>
              <a href="/catalog">Каталог</a>
              <a href="/about">О нас</a>
              <a href="/contacts">Контакты</a>
              <a href="/checkout">Оплата</a>
              <a href="/checkout/success">Возврат</a>
              <a href="/">Публичная оферта</a>
            </div>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerSubscribeTitle}>Подписаться на нас</div>
            <div className={styles.footerSubscribeRow}>
              <input className={styles.footerEmail} placeholder="" aria-label="Email для подписки" />
              <div className={styles.footerEnvelope} aria-hidden="true" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
