import { Link, useParams } from 'react-router-dom'
import styles from './ProductPage.module.scss'

function ProductPage({ products, onAddToCart }) {
  const { productId } = useParams()
  const product = products.find((item) => item.id === productId)
  const fullStars = Math.floor(Number(product?.rating || 0))

  if (!product) {
    return <section className={styles.emptyState}><h1>Товар не найден</h1><Link to="/catalog" className={styles.backBtn}>Вернуться в каталог</Link></section>
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
        <div className={styles.productMeta}><span className={styles.price}>{product.price} ₽</span><span className={styles.oldPrice}>{product.oldPrice} ₽</span></div>
        <button onClick={() => onAddToCart(product)} className={styles.addBtn}>Добавить в корзину</button>
      </div>
    </section>
  )
}

export default ProductPage
