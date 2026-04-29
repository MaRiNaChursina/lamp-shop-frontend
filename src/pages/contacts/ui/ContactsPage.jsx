import styles from './ContactsPage.module.scss'

function ContactsPage() {
  return (
    <section className={styles.page}>
      <h1>Контакты</h1>
      <p>Телефон: +7 (999) 777-77-77</p>
      <p>Email: info@lampshop.local</p>
      <p>Адрес: г. Москва, ул. Домостроителей, 10</p>
    </section>
  )
}

export default ContactsPage
