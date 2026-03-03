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
        return { success: false, message: { error: e.message || "Đã xảy ra lỗi" }};
    }
}

export const signUp = async () => {
    await auth.api.signUpEmail({
        body: {
            email: "ngophu02.lv@gmail.com",
            password: "1234abcd",
            name: "Admin"
        }
    })
}

// export { signUp, signIn };