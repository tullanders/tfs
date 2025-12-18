import { EntityTreeView } from './EntityTreeView'
import styles from './sidebar.module.css'

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Organisationsöversikt</h2>
      </div>
      <div className={styles.sidebarContent}>
        <EntityTreeView />
      </div>
    </aside>
  )
}
