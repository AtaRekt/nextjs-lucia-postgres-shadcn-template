"use client";
import { ActionResult } from "next/dist/server/app-render/types";
import { useState } from "react";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Playfair_Display } from "next/font/google";

const playfair_DisplayVariable = Playfair_Display({
    weight: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FormData {
    email: string;
    username: string;
    password: string;
}

export default function RegisterForm({ serverAction }: { serverAction: (formData: FormData) => Promise<ActionResult> }) {
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
            isValid
        }
    } = useForm({
        defaultValues: {
            email: "",
            username: "",
            password: ""
        },
        mode: "onBlur",
        criteriaMode: "all",
        reValidateMode: "onChange",
    });

    const registerFunc: SubmitHandler<FormData> = async (formData) => {
        console.log("registerFunc", formData);
        setError(null);
        const result = await serverAction(formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setError(null);
        }
    };

    const errorComponent = error ? <>
        <CardContent className="flex items-center justify-center">
            {error && <Label className="text-red-500 text-center">{error}</Label>}
        </CardContent>
    </> : null;

    return (
        <>
            <form onSubmit={handleSubmit(registerFunc)} className="flex flex-col w-96">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className={`text-3xl font-bold ${playfair_DisplayVariable.className} mb-2`}>Register</CardTitle>
                        <CardDescription>
                            Please register to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, })} placeholder="Enter email..." className={cn(`outline-none ${errors?.email ? 'border-red-500' : ''}`)} />
                            {errors.email?.type === "required" && (
                                <Label className="text-red-500">Email is required.</Label>
                            )}
                            {errors.email?.type === "pattern" && (
                                <Label className="text-red-500">Please enter a valid email.</Label>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input {...register("username", { required: true, minLength: 3, maxLength: 31 })} placeholder="Enter username..." className={cn(`outline-none ${errors?.username ? 'border-red-500' : ''}`)} />
                            {errors.username?.type === "required" && (
                                <Label className="text-red-500">Username is required.</Label>
                            )}
                            {errors.username?.type === "minLength" && (
                                <Label className="text-red-500">Username must be longer than 3 characters.</Label>
                            )}
                            {errors.username?.type === "maxLength" && (
                                <Label className="text-red-500">Username cannot be longer than 31 characters.</Label>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Enter password..." className={cn(`outline-none ${errors?.password ? 'border-red-500' : ''}`)} />
                            {errors.password?.type === "required" && (
                                <Label className="text-red-500">Password is required.</Label>
                            )}
                            {errors.password?.type === "minLength" && (
                                <Label className="text-red-500">Password must be at least 6 characters.</Label>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className={`w-full ${isSubmitting && "disabled opacity-50"}  ${!isValid && "disabled opacity-50"}`} disabled={!isValid || isSubmitting}>{isSubmitting ? "Loading..." : "Register"}</Button>
                        <div className="text-sm text-center">
                            Already have an account?{" "}
                            <Link href="/login" className="hover:underline font-semibold">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                    {errorComponent}
                </Card>
            </form>
        </>
    );
}