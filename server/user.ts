"use server";
import { auth } from "@/lib/auth"

type AuthResponse = {
  success: boolean
  message: string
  code?: string
}

export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    await auth.api.signInEmail({
      body: { email, password }
    })

    return {
      success: true,
      message: "Đăng nhập thành công"
    }

  } catch (error: any) {
    const message = error?.message || "Đã xảy ra lỗi"

    return {
      success: false,
      message,
      code: parseErrorCode(message)
    }
  }
}

export const signUp = async (
  email: string,
  password: string,
  username: string,
  role: "admin" | "teacher" = "teacher"
): Promise<AuthResponse> => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
        role,
      }
    })

    return {
      success: true,
      message: "Đăng ký thành công"
    }

  } catch (error: any) {
    const message = error?.message || "Đã xảy ra lỗi"

    return {
      success: false,
      message,
      code: parseErrorCode(message)
    }
  }
}

function parseErrorCode(message: string): string {
  const msg = message.toLowerCase()

  if (msg.includes("email") && msg.includes("exist")) {
    return "EMAIL_EXISTS"
  }

  if (msg.includes("invalid email")) {
    return "INVALID_EMAIL"
  }

  if (msg.includes("password")) {
    return "WEAK_PASSWORD"
  }

  return "UNKNOWN_ERROR"
}