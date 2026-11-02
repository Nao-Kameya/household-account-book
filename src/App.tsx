import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import GraphPage from "./pages/GraphPage"
import ExpensePage from "./pages/ExpensePage"
import "./App.css"
import { ROUTES } from "./ROUTES"
import { useEffect, useReducer, useState } from "react"
import type { State, Action } from "./types/expense"
import { onAuthStateChanged } from "firebase/auth"
import type { User } from "firebase/auth"
import { auth } from "./firebase"

function App() {

    const [currentMonth, setCurrentMonth] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        return `${year}-${String(month).padStart(2, "0")}`
      })
    const [user, setUser] = useState<User | null>(null)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

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

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        // ログイン状態が変わったら、以前の支出一覧を消す
        dispatch({ type: "SET_ALL", payload: [] })

        setUser(currentUser)
        setIsCheckingAuth(false)
      })

      return () => {
        unsubscribe()
      }
    }, [])

    if (isCheckingAuth) {
      return <p>ログイン状態を確認中...</p>
    }
    
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage user={user} />}/>
        <Route 
          path={ROUTES.EXPENSE} 
          element={
            user ? (
              <ExpensePage 
                state={state} 
                dispatch={dispatch}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
              />
            ) : (
              <Navigate to={ROUTES.HOME} replace />
            )
        }/>
        <Route 
          path={ROUTES.GRAPH} 
          element={
            user ? (
              <GraphPage state={state}/>
            ) : (
              <Navigate to={ROUTES.HOME} replace />
            )}/>   
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
