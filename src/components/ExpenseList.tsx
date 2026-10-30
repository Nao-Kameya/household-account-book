import type { Expense } from "../types/expense"
import styles from "../styles/ExpenseList.module.css"

type ExpenseListProps = {
    expenses: Expense[]
    onChange: (id: number) => void
}

export default function ExpenseList({expenses, onChange}: ExpenseListProps) {
  return (
    <div>
      <ul className={styles.expenseList}>
        {expenses.map((expense) => {
          return (
            <li key={expense.id} className={styles.expenseItem}>
              <div className={styles.expenseInfo}>
                <span className={styles.expenseCategory}>
                  {expense.category}
                </span>
                <span className={styles.expenseAmount}>
                  ¥{expense.amount}
                </span>
              </div>
              <input
                type="checkbox"
                checked={expense.checked}
                onChange={() => onChange(expense.id)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}