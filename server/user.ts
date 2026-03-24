"use server";
import { auth } from "@/lib/auth"

export const signIn = async (email: string, password: string) => {
    try{
        await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })
        return { success: true , message: "Đăng nhập thành công"};
    } catch (error) {
        const e = error as Error;
        return { success: false, message: e.message || "Đã xảy ra lỗi" };
    }
}

export const signUp = async (email: string, password: string, username: string, role: "admin" | "teacher" = "teacher") => {
    try {
    await auth.api.signUpEmail({
        body: {
            email,
            password,
            name: username,
            role,
        }
    })
    return { success: true, message: "Đăng ký thành công" };
} catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "Đã xảy ra lỗi" };
}
}

// export { signUp, signIn };