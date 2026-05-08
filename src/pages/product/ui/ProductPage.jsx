import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { clearProductDetail, loadProductDetail } from '../../../entities/product/model/productsSlice'
import styles from './ProductPage.module.scss'

function ProductPage({ onAddToCart }) {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const detail = useSelector((s) => s.products.detail)
  const detailId = useSelector((s) => s.products.detailId)
  const detailStatus = useSelector((s) => s.products.detailStatus)
  const detailError = useSelector((s) => s.products.error)

  useEffect(() => {
    dispatch(loadProductDetail(productId))
    return () => {
      dispatch(clearProductDetail())
    }
  }, [dispatch, productId])

  const product = detailId === productId ? detail : null
  const fullStars = Math.floor(Number(product?.rating || 0))

  if (detailStatus === 'loading' || detailStatus === 'idle') {
    return (
      <section className={styles.emptyState}>
        <h1>Загрузка…</h1>
        <Link to="/catalog" className={styles.backBtn}>Вернуться в каталог</Link>
      </section>
    )
  }

  if (!product) {
    return (
      <section className={styles.emptyState}>
        <h1>{detailStatus === 'failed' ? 'Не удалось загрузить товар' : 'Товар не найден'}</h1>
        {detailError ? <p>{detailError}</p> : null}
        <Link to="/catalog" className={styles.backBtn}>Вернуться в каталог</Link>
      </section>
    )
  }

  return (
    <section className={styles.productPage}>
      <div className={styles.productPageImage}>
        {product.imageUrl ? <img src={product.imageUrl} alt="" loading="lazy" decoding="async" /> : 'Фото товара'}
      </div>
      <div>
        <h1>{product.name}</h1>
        <div className={styles.ratingRow} aria-label={`Рейтинг ${product.rating || 0}`}>
          <div className={styles.stars}>
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
          <span className={styles.reviewsText}>({Math.max(1, Math.round((product.rating || 1) * 8))} отзывов)</span>
        </div>
        <p>{product.description}</p>
        <ul className={styles.specs}>
          <li>Мощность: {product.powerWatts} Вт</li>
          <li>Цоколь: {product.baseType}</li>
          <li>Цветовая температура: {product.colorTempK || 'RGB'} K</li>
          <li>Наличие: {product.stock} шт.</li>
        </ul>
        <div className={styles.productMeta}>
          <span className={styles.price}>{product.price} ₽</span>
          {product.oldPrice ? <span className={styles.oldPrice}>{product.oldPrice} ₽</span> : null}
        </div>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className={styles.addBtn}
          disabled={typeof product.stock === 'number' ? product.stock < 1 : false}
        >
          Добавить в корзину
        </button>
      </div>
    </section>
  )
}

export default ProductPage
