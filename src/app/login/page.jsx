// 'use client'
// import Link from "next/link"
// import { useForm } from 'react-hook-form';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card"
// import { Input } from "../../components/ui/input"
// import { Label } from "../../components/ui/label"
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Button } from "../../components/ui/button";
// import { signIn } from "next-auth/react";

// export const description =
//   "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account."

// export default function LoginForm() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const router = useRouter()

//   const onSubmit = async(data) => {
//     try {
//       const res = await axios.post('/api/users/login', data)
//       console.log(res.data)
//       router.push('/predictions')
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleGoogleSignIn = () => {
//     signIn("google", { callbackUrl: "/predictions" });
//   }

//   return (
//     <Card className="mx-auto max-w-sm">
//       <CardHeader>
//         <CardTitle className="text-2xl">Login</CardTitle>
//         <CardDescription>
//           Enter your email below to login to your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="m@example.com"
//               required
//               {...register('email', {
//                 required: 'Email is required',
//                 // pattern: {
//                 //   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                 //   message: 'Invalid email address',
//                 // },
//               })}
//               />
//               {errors.email && <p>{errors.email.message}</p>}
//           </div>
//           <div className="grid gap-2">
//             <div className="flex items-center">
//               <Label htmlFor="password">Password</Label>
//               <Link href="#" className="ml-auto inline-block text-sm underline">
//                 Forgot your password?
//               </Link>
//             </div>
//             <Input id="password" type="password" required   {...register('password', { required: 'Password is required', minLength: { value: 4, message: 'Password must be at least 4 characters' } })}/>
//             {errors.password && <p>{errors.password.message}</p>}
//           </div>
//           <Button type="submit" className="w-full">
//             Login
//           </Button>
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full"
//             onClick={handleGoogleSignIn}
//           >
//             Login with Google
//           </Button>
//         </div>
//         <div className="mt-4 text-center text-sm">
//           Don&apos;t have an account?{" "}
//           <Link href="/signup" className="underline">
//             Sign up
//           </Link>
//         </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }
"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/users/login", data);
      console.log(res.data);
      router.push("/predictions");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.error || "An error occurred during login");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { callbackUrl: "/predictions" });
      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setError("An error occurred during Google sign in");
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ... existing form fields ... */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
                  },
                })}
              />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full mb-2">
              Login
            </Button>
          </div>
        </form>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          Login with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
