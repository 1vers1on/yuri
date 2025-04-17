import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

export interface JWTPayload {
    id: number;
    username: string;
}

const prisma = new PrismaClient();

function generateToken() {
    return randomBytes(32).toString("hex");
}

async function createRefreshToken(userId: number) {
    const user = await prisma.users.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const token = generateToken();


    const refreshToken = await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
    });

    return refreshToken.token;
}

async function refresh(refreshToken: string) {
    const refresh = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
    });

    if (!refresh) {
        throw new Error("Invalid refresh token");
    }

    if (refresh.expires < new Date()) {
        throw new Error("Refresh token expired");
    }

    const user = await prisma.users.findUnique({
        where: { id: refresh.userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }
    
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        token
    };
}

async function register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    const refreshToken = await createRefreshToken(user.id);
    
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        token,
        refreshToken,
    };
}

async function login(username: string, password: string) {
    const user = await prisma.users.findUnique({
        where: { username },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Invalid password");
    }

    const refreshToken = await createRefreshToken(user.id);

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        token,
        refreshToken,
    };
}
