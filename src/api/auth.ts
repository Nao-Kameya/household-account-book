import type { User } from "firebase/auth"
import { API_BASE_URL } from "./config"
import { auth } from "../firebase"

type AuthUserResponse = {
  uid: string
}

export async function fetchAuthUser(
  user: User
): Promise<AuthUserResponse> {
  const idToken = await user.getIdToken()

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  })

  if (!response.ok) {
    throw new Error(
      `サーバーでの本人確認に失敗しました（${response.status}）`
    )
  }

  return await response.json()
}

export async function getAuthHeaders(): Promise<{
    Authorization: string
}> {
    const user = auth.currentUser

    if(!user) {
        throw new Error("ログインが必要です")
    }

    const idToken = await user.getIdToken()

    return {
        Authorization: `Bearer ${idToken}`
    }
}