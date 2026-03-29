"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  FieldGroup,
} from "@/components/ui/field"
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
import { useRouter } from "next/navigation"
import React from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  username: z.string().min(3, "Tên người dùng phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  role: z.enum(["admin", "teacher"]),
})

export function SignupForm({
  className,
  isAdminMode = false,
  ...props
}: React.ComponentProps<"form"> & { isAdminMode?: boolean }) {

  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

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
    setIsLoading(true)

    let success = false
    let message = ""

    try {
      if (isAdminMode) {
        // ✅ ADMIN → gọi API (KHÔNG login)
        const response = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            name: values.username,
            role: values.role,
          }),
        })

        const data = await response.json()
        success = response.ok
        message = data.message || (success ? "Tạo tài khoản thành công" : "Có lỗi xảy ra")

      } else {
        // ✅ USER → đăng ký bình thường (có login)
        const res = await signUp(
          values.email,
          values.password,
          values.username,
          values.role
        )

        success = res.success
        message = res.message as string
      }

      if (success) {
        toast.success(message)

        if (!isAdminMode) {
          router.push("/dashboard")
        } else {
          form.reset()
        }

      } else {
        toast.error(message)
      }

    } catch (err) {
      toast.error("Có lỗi xảy ra")
    }

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">
              {isAdminMode ? "Tạo tài khoản" : "Đăng ký tài khoản"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isAdminMode
                ? "Tạo tài khoản cho giáo viên hoặc admin"
                : "Nhập thông tin để đăng ký"}
            </p>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl>
                  <Input placeholder="Tên người dùng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isAdminMode && (
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="teacher">Giáo viên</option>
                      <option value="admin">Admin</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isAdminMode ? (
              "Tạo tài khoản"
            ) : (
              "Đăng ký"
            )}
          </Button>
        </FieldGroup>
      </form>
    </Form>
  )
}