import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import ProductCard from '../../../entities/product/ui/ProductCard'
import styles from './CatalogPage.module.scss'

function CatalogPage({ products, onAddToCart }) {
  const categories = useSelector((s) => s.products.categories)
  const listStatus = useSelector((s) => s.products.listStatus)
  const listError = useSelector((s) => s.products.error)

  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatch = category === 'all' || product.categoryId === category
        const searchMatch = (product.name || '').toLowerCase().includes(search.toLowerCase())
        return categoryMatch && searchMatch
      }),
    [products, category, search],
  )

  return (
    <section>
      <div className={styles.sectionHead}><h1>Каталог</h1></div>
      {listStatus === 'loading' ? <p className={styles.emptyState}>Загрузка каталога…</p> : null}
      {listStatus === 'failed' && listError ? (
        <p className={styles.emptyState} role="alert">{listError}</p>
      ) : null}
      <div className={styles.catalogFilters}>
        <select className={styles.control} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          className={styles.control}
          type="text"
          placeholder="Поиск товара"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.productsGrid}>
        {filtered.length > 0
          ? filtered.map((product) => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)
          : listStatus !== 'loading'
            ? <p className={styles.emptyState}>По вашему запросу товары не найдены.</p>
            : null}
      </div>
    </section>
  )
}

export default CatalogPage
