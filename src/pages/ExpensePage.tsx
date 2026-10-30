import { ChangeEvent, useEffect, useState } from 'react'
import Budget from '../components/Budget'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import { ROUTES } from '../ROUTES'
import { Link } from 'react-router-dom'
import type { State, Action, NewExpense } from "../types/expense"
import styles from "../styles/ExpensePage.module.css"
import { fetchExpenses, createExpense, toggleExpenseChecked, deleteCheckedExpenses } from "../api/expenses"
import { fetchBudget, saveBudget } from "../api/budgets"
import Modal from "../components/Modal"

type Props = {
  state: State
  dispatch: React.Dispatch<Action>;
  currentMonth: string
  setCurrentMonth: React.Dispatch<React.SetStateAction<string>>
}

export default function ExpensePage({state, dispatch, currentMonth, setCurrentMonth}: Props) {
    const [variableValue, setVariableValue] = useState("");
    const [fixedValue, setFixedValue] = useState("");
    const [expenseType, setExpenseType] = useState<"fixed" | "variable" | null>(null)
    const [costValue, setCostValue] = useState(0);
    const [inputBudget, setInputBudget] = useState("");
    const [budget, setBudget] = useState<number | null>(null);
    const [expensesError, setExpensesError] = useState<string | null>(null)
    const [budgetError, setBudgetError] = useState<string | null>(null)
    const [addExpenseError, setAddExpenseError] = useState<string | null>(null)
    const [isAddingExpense, setIsAddingExpense] = useState(false)
    const [checkExpenseError, setCheckExpenseError] = useState<string | null>(null)
    const [isUpdatingChecked, setIsUpdatingChecked] = useState(false)
    const [deleteExpenseError, setDeleteExpenseError] = useState<string | null>(null)
    const [isDeletingExpense, setIsDeletingExpense] = useState(false)
    const [saveBudgetError, setSaveBudgetError] = useState<string | null>(null)
    const [isSavingBudget, setIsSavingBudget] = useState(false)
    const [budgetRefreshKey, setBudgetRefreshKey] = useState(0)
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false) 

    const handleBudget = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      setInputBudget(e.target.value);
    }

    useEffect(() => {
      let ignore = false

      const loadBudget = async () => {
        setBudgetError(null)
        setBudget(null)

        try {
          const data = await fetchBudget(currentMonth)

          if (!ignore) {
            setBudget(data.amount)
          }
        } catch (error) {
          if (!ignore) {
            setBudgetError(
              error instanceof Error
                ? error.message
                : "予算の取得中にエラーが発生しました"
            )
          }
        }
      }

      loadBudget()

      return () => {
        ignore = true
      }
    }, [currentMonth, budgetRefreshKey])

    useEffect(() => {
      let ignore = false

      const loadExpenses = async () => {
        setExpensesError(null)

        try {
          const expenses = await fetchExpenses(currentMonth)

          if (!ignore) {
            dispatch({ type: "SET_ALL", payload: expenses })
          }
        } catch (error) {
          if (!ignore) {
            setExpensesError(
              error instanceof Error
                ? error.message
                : "支出の取得中にエラーが発生しました"
            )
          }
        }
      }

      loadExpenses()

      return () => {
        ignore = true
      }
    }, [currentMonth, dispatch])
  
    const handleSaveBudget = async () => {
      if (isSavingBudget) return

      setSaveBudgetError(null)

      const amount = Number(inputBudget)

      if (
        !inputBudget.trim() ||
        !Number.isFinite(amount) ||
        amount < 0
      ) {
        setSaveBudgetError("予算は0以上の数値を入力してください")
        return
      }

      setIsSavingBudget(true)

      try {
        await saveBudget(currentMonth, amount)

        // 表示中の月の予算を、取得処理で読み直す
        setBudgetRefreshKey((key) => key + 1)
        
      } catch (error) {
        setSaveBudgetError(
          error instanceof Error
            ? error.message
            : "予算の保存中にエラーが発生しました"
        )
      } finally {
        setIsSavingBudget(false)
      }
    }

    const handleFixed = (e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => {
      setFixedValue(e.target.value);
      setExpenseType("fixed");
    }
  
    const handleVariable = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      setVariableValue(e.target.value);
      setExpenseType("variable");
    }
  
    const handleCostValue = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      setCostValue(Number(e.target.value));
    }
  
    const handleAddExpense = async () => {
      if (isAddingExpense) return

      setAddExpenseError(null)

      const category =
        expenseType === "fixed" ? fixedValue : variableValue

      if (!expenseType || !category.trim()) {
        setAddExpenseError("固定費または変動費を入力してください")
        return
      }

      if (!Number.isFinite(costValue) || costValue <= 0) {
        setAddExpenseError("金額は0より大きい数値を入力してください")
        return
      }

      const newExpense: NewExpense = {
        amount: costValue,
        category: category.trim(),
        checked: false,
        type: expenseType,
        month: currentMonth
      }

      setIsAddingExpense(true)

      try {
        const savedExpense = await createExpense(newExpense)

        dispatch({ type: "ADD", payload: savedExpense })

        setVariableValue("")
        setFixedValue("")
        setExpenseType(null)
        setCostValue(0)

        setIsExpenseModalOpen(false)
      } catch (error) {
        setAddExpenseError(
          error instanceof Error
            ? error.message
            : "支出の追加中にエラーが発生しました"
        )
      } finally {
        setIsAddingExpense(false)
      }
    }

    const handleDelete = async () => {
      if (isDeletingExpense || isUpdatingChecked) return

      setDeleteExpenseError(null)
      setIsDeletingExpense(true)

      try {
        const expenses = await deleteCheckedExpenses(currentMonth)

        dispatch({
          type: "SET_ALL",
          payload: expenses
        })

        setIsDeleteModalOpen(false)
      } catch (error) {
        setDeleteExpenseError(
          error instanceof Error
            ? error.message
            : "支出の削除中にエラーが発生しました"
        )
      } finally {
        setIsDeletingExpense(false)
      }
    }
  
    const handleChecked = async (id: number) => {
      if (isUpdatingChecked || isDeletingExpense) return

      setCheckExpenseError(null)
      setIsUpdatingChecked(true)

      try {
        const updatedExpense = await toggleExpenseChecked(id)

        dispatch({
          type: "UPDATE",
          payload: updatedExpense
        })
      } catch (error) {
        setCheckExpenseError(
          error instanceof Error
            ? error.message
            : "チェック状態の更新中にエラーが発生しました"
        )
      } finally {
        setIsUpdatingChecked(false)
      }
    }
  
    useEffect(() => {
    if (!fixedValue && !variableValue) {
      setExpenseType(null);
    }

  }, [fixedValue, variableValue]);

    const filteredExpenses = state.expenses.filter(
      expense => expense.month === currentMonth
    )

    const handleOpenDeleteModal = () => {
      const hasCheckedExpense = filteredExpenses.some(
        (expense) => expense.checked
      )

      if(!hasCheckedExpense) {
        window.alert("削除する支出にチェックを入れてください")
        return
      }

      setDeleteExpenseError(null)
      setIsDeleteModalOpen(true)
    }
  
    const total = filteredExpenses.reduce((sum, expense) => {
      return sum + expense.amount
    }, 0)

    
  
    const remaining = (budget ?? 0) - total;
  
    return (
      <>
  <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>家計簿</h1>
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className={styles.monthInput}
        />
      </header>

      <div className={styles.topGrid}>
        <section className={`${styles.card} ${styles.actionCard}`}>
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.budgetButton}
              onClick={() => {
                setSaveBudgetError(null)
                setInputBudget("")
                setIsBudgetModalOpen(true)
              }}
            >
              予算設定
            </button>

            <button
              type="button"
              className={styles.addButton}
              onClick={() => {
                setAddExpenseError(null)
                setIsExpenseModalOpen(true)
              }}
            >
              支出の追加
            </button>

            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleOpenDeleteModal}
              disabled={isDeletingExpense || isUpdatingChecked}
            >
              削除
            </button>
          </div>

          {budgetError && (
            <p role="alert">{budgetError}</p>
          )}

          <p className={styles.remainingBudget}>
            {budgetError
              ? "残り予算：取得できませんでした"
              : budget === null
                ? "残り予算：読み込み中..."
                : `残り予算：¥${remaining.toLocaleString("ja-JP")}`}
          </p>
        </section>
      </div>

      <section className={styles.card}>
        <h2>支出一覧</h2>
        {checkExpenseError && (
          <p role="alert">{checkExpenseError}</p>
        )}
        {expensesError && (
          <p role="alert">{expensesError}</p>
        )}
        <fieldset
          disabled={isUpdatingChecked || isDeletingExpense}
          style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
        >
          <legend>支出の選択</legend>
          <ExpenseList
            expenses={filteredExpenses}
            onChange={handleChecked}
          />
        </fieldset>
      </section>

      <nav className={styles.linkRow}>
        <Link to={ROUTES.HOME}>ホームページへ</Link>
        <Link to={ROUTES.GRAPH}>グラフへ</Link>
      </nav>
      {isExpenseModalOpen && (
        <Modal
          labelledBy="add-expense-heading"
          onClose={() => setIsExpenseModalOpen(false)}
          isSaving={isAddingExpense}
        >
          {addExpenseError && (
            <p role="alert">{addExpenseError}</p>
          )}

          <fieldset
            disabled={isAddingExpense}
            style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
          >
            <h2 id="add-expense-heading">支出を追加</h2>

            <ExpenseForm
              fixedValue={fixedValue}
              variableValue={variableValue}
              costValue={costValue}
              expenseType={expenseType}
              onFixedChange={handleFixed}
              onVariableChange={handleVariable}
              onCostChange={handleCostValue}
            />

            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddExpense}
            >
              {isAddingExpense ? "追加中..." : "追加"}
            </button>
          </fieldset>

          <button
            type="button"
            onClick={() => setIsExpenseModalOpen(false)}
            disabled={isAddingExpense}
          >
            閉じる
          </button>
        </Modal>
      )}
      {isDeleteModalOpen && (
        <Modal
          labelledBy="delete-expense-heading"
          onClose={() => setIsDeleteModalOpen(false)}
          isSaving={isDeletingExpense}
        >
          <p>チェック済み支出を削除します。よろしいでしょうか？</p>

          {deleteExpenseError && (
            <p role="alert">{deleteExpenseError}</p>
          )}

          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isDeletingExpense || isUpdatingChecked}
          >
            {isDeletingExpense ? "削除中..." : "はい"}
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeletingExpense}
            autoFocus
          >
            キャンセル
          </button>
        </Modal>
      )}
      {isBudgetModalOpen && (
        <Modal
          labelledBy="budget-heading"
          onClose={() => setIsBudgetModalOpen(false)}
          isSaving={isSavingBudget}
        >
          <h2 id="budget-heading">予算設定</h2>
          <p>{currentMonth} の予算</p>

          {saveBudgetError && (
            <p role="alert">{saveBudgetError}</p>
          )}

          <fieldset
            disabled={isSavingBudget}
            style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
          >
            <legend>予算の入力</legend>

            <Budget
              onChange={handleBudget}
              remaining={remaining}
              onClick={handleSaveBudget}
              isSaving={isSavingBudget}
            />
          </fieldset>

          <button
            type="button"
            onClick={() => setIsBudgetModalOpen(false)}
            disabled={isSavingBudget}
          >
            キャンセル
          </button>
        </Modal>
      )}
    </div>
    </>
    )
}