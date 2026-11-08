import { useState } from "react"
import { Link } from "react-router-dom"
import { signInWithPopup, signOut} from "firebase/auth"
import type { User } from "firebase/auth"
import { auth, googleProvider } from "../firebase"
import { ROUTES } from "../ROUTES"
import { fetchAuthUser } from "../api/auth"

type HomePageProps = {
  user: User | null
}

export default function HomePage({ user }: HomePageProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (isProcessing) return

    setError(null)
    setIsProcessing(true)

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ログインに失敗しました"
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLogout = async () => {
    if (isProcessing) return

    setError(null)
    setIsProcessing(true)

    try {
      await signOut(auth)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ログアウトに失敗しました"
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCheckAuth = async () => {
    if (!user || isProcessing) return

    setError(null)
    setIsProcessing(true)

    try {
      const data = await fetchAuthUser(user)

      if (data.uid !== user.uid) {
        throw new Error("ユーザーIDが一致しません")
      }

      window.alert("サーバーでの本人確認に成功しました")
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "本人確認中にエラーが発生しました"
      )
    } finally {
      setIsProcessing(false)
    }
  }


  return (
    <div>
      <h1>家計簿アプリ</h1>

      {error && <p role="alert">{error}</p>}

      {user ? (
        <>
          <p>{user.displayName ?? "ユーザー"}さん</p>

          <button
            type="button"
            onClick={handleCheckAuth}
            disabled={isProcessing}
          >
            {isProcessing ? "処理中..." : "サーバーで本人確認"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isProcessing}
          >
            {isProcessing ? "処理中..." : "ログアウト"}
          </button>

          <nav>
            <Link to={ROUTES.EXPENSE}>記録へ</Link>
            <Link to={ROUTES.GRAPH}>グラフへ</Link>
          </nav>
        </>
      ) : (
        <button
          type="button"
          onClick={handleLogin}
          disabled={isProcessing}
        >
          {isProcessing ? "ログイン中..." : "Googleでログイン"}
        </button>
      )}
    </div>
  )
}