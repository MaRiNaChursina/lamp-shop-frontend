import { Link } from 'react-router-dom'
import ProductCard from '../../../entities/product/ui/ProductCard'
import styles from './HomePage.module.scss'

function HomePage({ products, onAddToCart }) {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Современное освещение для дома</h1>
          <Link to="/catalog" className={styles.heroBtn}>Смотреть каталог</Link>
        </div>
      </section>
      <section>
        <div className={styles.sectionHead}><h2>Популярные товары</h2></div>
        <div className={styles.productsGrid}>
          {products.map((product) => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
        </div>
      </section>
    </div>
  )
}

export default HomePage
