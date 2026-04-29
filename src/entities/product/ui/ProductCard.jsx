import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './ProductCard.module.scss'

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

function ProductCard({ product, onAddToCart }) {
  const rating = Number(product.rating || 0)
  const fullStars = Math.floor(rating)
  const [favoriteIds, setFavoriteIds] = useState(() => new Set(loadFavorites()))

  useEffect(() => {
    setFavoriteIds(new Set(loadFavorites()))
  }, [])

  const toggleFavorite = () => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(product.id)) next.delete(product.id)
      else next.add(product.id)
      try {
        localStorage.setItem('lampshop_favorites', JSON.stringify(Array.from(next)))
      } catch {
        // ignore
      }
      return next
    })
  }

  const isFav = favoriteIds.has(product.id)

  return (
    <article className={styles.productCard}>
      <div className={styles.productImageWrap}>
        <Link to={`/product/${product.id}`} className={styles.productImage} aria-label={product.name}>
          {product.imageUrl ? (
            <img
              className={styles.productImageImg}
              src={product.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className={styles.productImageText}>изображение</span>
          )}
        </Link>

      </div>

      <div className={styles.ratingRow} aria-label={`Рейтинг ${rating}`}>
        <div className={styles.productRating}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`${styles.star} ${i < fullStars ? styles.starFilled : styles.starEmpty}`}
              aria-hidden="true"
            >
              {i < fullStars ? '★' : '☆'}
            </span>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.favoriteBtnInline} ${isFav ? styles.favoriteBtnOn : ''}`}
          aria-label="В избранное"
          onClick={toggleFavorite}
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
      </div>

      <div className={styles.productInfo}>
        <h3 className={styles.productName}>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <div className={styles.productBottom}>
          <div className={styles.productPrice}>{product.price} ₽</div>

          <div className={styles.productBottomRight}>
            <div className={styles.productStock}>В наличии: {product.stock} шт</div>
            <button type="button" className={styles.productCartBtn} onClick={() => onAddToCart(product)}>
              В корзину
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
