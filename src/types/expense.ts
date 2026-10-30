export type Expense = {
    id: number
    amount: number
    category: string
    checked:boolean
    type: "fixed" | "variable" | null
    month: string
}

export type NewExpense = Omit<Expense, "id">

export type State = {
    expenses: Expense[]
}

export type Action =
  | { type: "ADD"; payload: Expense }
  | { type: "UPDATE"; payload: Expense }
  | { type: "DELETE" }
  | { type: "SET_ALL"; payload: Expense[] }