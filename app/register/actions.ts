import { db } from "@/db";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { ActionResult } from "next/dist/server/app-render/types";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface FormData {
    email: string;
    username: string;
    password: string;
}

export async function signup(formData: FormData): Promise<ActionResult> {
    "use server";
    const username = formData?.username;
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return {
            error: "Invalid username"
        };
    }

    const email = formData?.email;
    if (
        typeof email !== "string" || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
        return {
            error: "Invalid email"
        };
    }


    const password = formData?.password;
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return {
            error: "Invalid password"
        };
    }

    const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long

    const existingEmail = await db.query.userTable.findFirst({
        where: eq(userTable.email, email.toLowerCase())
    });

    if (existingEmail) {
        return {
            error: "Email already exists"
        };
    }

    const existingUsername = await db.query.userTable.findFirst({
        where: eq(userTable.username, username)
    });

    if (existingUsername) {
        return {
            error: "Username already exists"
        };
    }

    await db.insert(userTable).values({
        id: userId,
        email: email.toLowerCase(),
        username: username,
        password_hash: passwordHash
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/dashboard");
}