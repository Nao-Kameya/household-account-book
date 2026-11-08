import type { Expense, NewExpense } from "../types/expense"
import { getAuthHeaders } from "./auth"
import { API_BASE_URL } from "./config"

export async function fetchExpenses(
    month: string
): Promise<Expense[]> {
    const headers = await getAuthHeaders()

    const response = await fetch(
        `${API_BASE_URL}/transactions?month=${encodeURIComponent(month)}`,
        { headers }
    )

    if(!response.ok) {
        throw new Error(
            `支出の取得に失敗しました（${response.status}）`
        )
    } 

    return await response.json()
}

export async function createExpense(
  expense: NewExpense
): Promise<Expense> {
  const authHeaders = await getAuthHeaders()

  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expense)
  })

  if (!response.ok) {
    throw new Error(
      `支出の追加に失敗しました（${response.status}）`
    )
  }

  return await response.json()
}

export async function toggleExpenseChecked(
  id: number
): Promise<Expense> {
  const headers = await getAuthHeaders()

  const response = await fetch(
    `${API_BASE_URL}/transactions/${id}`,
    {
      method: "PATCH",
      headers
    }
  )

  if (!response.ok) {
    throw new Error(
      `チェック状態の更新に失敗しました（${response.status}）`
    )
  }

  return await response.json()
}

export async function deleteCheckedExpenses(
  month: string
): Promise<Expense[]> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_BASE_URL}/transactions?month=${encodeURIComponent(month)}`, {
    method: "DELETE",
    headers
  })

  if (!response.ok) {
    throw new Error(
      `支出の削除に失敗しました（${response.status}）`
    )
  }

  return await response.json()
}