"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUp } from "../server/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import React from "react"
import { Loader2, Eye, EyeOff } from "lucide-react"

const formSchema = z.object({
  username: z.string().min(3, "Tên người dùng phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  role: z.enum(["admin", "teacher"]),
})

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "teacher",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLoading) return

    try {
      setIsLoading(true)

      const res = await signUp(
        values.email,
        values.password,
        values.username,
        values.role
      )

      if (!res) {
        toast.error("Có lỗi xảy ra, vui lòng thử lại")
        return
      }

      const { success, message, code } = res

      if (success) {
        toast.success(message || "Tạo tài khoản thành công")

        form.reset()
      } else {
        if (code === "EMAIL_EXISTS") {
          form.setError("email", {
            message: "Email đã tồn tại",
          })
          form.setFocus("email")
        }

        toast.error(message || "Tạo tài khoản thất bại")
      }

    } catch (error) {
      console.error(error)
      toast.error("Lỗi hệ thống, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6 transition-all duration-300", className)}
        {...props}
      >
        <FieldGroup>
          {/* HEADER */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Tạo tài khoản
            </h1>
            <p className="text-sm text-muted-foreground">
              Nhập thông tin để tạo tài khoản
            </p>
          </div>

          {/* USERNAME */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nguyễn Văn A"
                    disabled={isLoading}
                    className="focus-visible:ring-2 focus-visible:ring-blue-500 transition"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    disabled={isLoading}
                    className="focus-visible:ring-2 focus-visible:ring-blue-500 transition"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PASSWORD */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      className="pr-10 focus-visible:ring-2 focus-visible:ring-blue-500 transition"
                      {...field}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* ROLE (GIỮ LẠI) */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vai trò</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={isLoading}
                    className="w-full border rounded-lg px-3 py-2 
                    focus:ring-2 focus:ring-blue-500 transition 
                    bg-white"
                  >
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Admin</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BUTTON */}
          <Button
            type="submit"
            className="w-full transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Tạo tài khoản"
            )}
          </Button>
        </FieldGroup>
      </form>
    </Form>
  )
}