import { Link } from "react-router-dom"
import { ROUTES } from "../ROUTES"
import type { State } from "../types/expense"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Props = {
  state:State
  // currentMonth: string
}

export default function GraphPage({state}: Props) {
  const monthlyTotals = state.expenses.reduce((acc, expense) => {
    const month = expense.month

    if(!acc[month]){
      acc[month] = 0;
    }

    acc[month] += expense.amount;
    
    return acc;

  }, {} as Record<string, number>)

  const data = Object.entries(monthlyTotals).map(([month, total]) => {
    return {
      month,
      total
    }
  })

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month"/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="total"/>
        </BarChart>
      </ResponsiveContainer>

      <Link to={ROUTES.EXPENSE}>ExpensePageへ</Link>
      <Link to={ROUTES.HOME}>HomePageへ</Link>
    </>
  )
}