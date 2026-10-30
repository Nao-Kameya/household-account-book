import styles from "../styles/Budget.module.css"

type BudgetProps = {
    remaining:number
    onChange:(e: React.ChangeEvent<HTMLInputElement>) => void
    onClick:() => void
    isSaving: boolean
}

export default function Budget({remaining, onChange, onClick, isSaving}: BudgetProps) {
  return (
    <div className={styles.budgetBox}>
      <input
        type="text"
        className={styles.inputBudget}
        onChange={onChange}
        placeholder="予算を入力"
      />
      <button onClick={onClick} className={styles.budgetButton} disabled={isSaving}>
        予算を追加
      </button>
      <p className={styles.remainingLabel}>残り予算</p>
      <h2 className={styles.remainingAmount}>¥{remaining}</h2>
    </div>
  )
}