import { API_BASE_URL } from "./config"

type BudgetResponse = {
  amount: number
}

export async function fetchBudget(
  month: string
): Promise<BudgetResponse> {
  const response = await fetch(
    `${API_BASE_URL}/budget/${encodeURIComponent(month)}`
  )

  if (!response.ok) {
    throw new Error(
      `予算の取得に失敗しました（${response.status}）`
    )
  }

  return await response.json()
}

export async function saveBudget(
  month: string,
  amount: number
): Promise<BudgetResponse> {
  const response = await fetch(`${API_BASE_URL}/budget`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ month, amount })
  })

  if (!response.ok) {
    throw new Error(
      `予算の保存に失敗しました（${response.status}）`
    )
  }

  return await response.json()
}