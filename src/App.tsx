import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import GraphPage from "./pages/GraphPage"
import ExpensePage from "./pages/ExpensePage"
import "./App.css"
import { ROUTES } from "./ROUTES"
import { useReducer, useState } from "react"
import type { State, Action} from "./types/expense"


function App() {

    const [currentMonth, setCurrentMonth] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        return `${year}-${String(month).padStart(2, "0")}`
      })

    const initialState: State = {
      expenses: []
    }
  
   
    
    const reducer = (state: State, action: Action) => {
      switch(action.type){
        case "ADD":
          return {
            ...state,
            expenses: [...state.expenses, action.payload]
          }
        
        case "UPDATE":
          return {
            ...state,
            expenses: state.expenses.map((expense) =>
              expense.id === action.payload.id
                ? action.payload
                : expense
            )
          }
  
        case "DELETE":
          return {
            ...state,
            expenses: state.expenses.filter((expense)=> expense.checked != true)
          }

        case "SET_ALL":
          return {
            ...state,
            expenses: action.payload
          }
  
         default:
          return state;
      }
    }

    const [state, dispatch] = useReducer(reducer, initialState,);

    
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />}/>
        <Route path={ROUTES.EXPENSE} element={
          <ExpensePage 
            state={state} 
            dispatch={dispatch}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
        />}/>
        <Route path={ROUTES.GRAPH} element={<GraphPage state={state}/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
