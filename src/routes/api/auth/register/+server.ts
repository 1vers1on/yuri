import { json, error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function POST({ request }) {
    // return something useless for now
    return json({ message: "ok" });
}
