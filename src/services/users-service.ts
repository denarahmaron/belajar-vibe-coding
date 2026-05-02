import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export class UsersService {
  async registerUser({ name, email, password }: any) {
    // 1. Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    // 2. Hash password
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // 3. Insert user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { data: "OK" };
  }

  async login({ email, password }: any) {
    // 1. Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error("Email atau password salah");
    }

    // 2. Verify password
    const isPasswordValid = await Bun.password.verify(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email atau password salah");
    }

    // 3. Generate session token
    const token = crypto.randomUUID();

    // 4. Save session
    await db.insert(sessions).values({
      name: token,
      userId: user.id,
    });

    return token;
  }

  async getCurrentUser(token: string) {
    if (!token) {
      throw new Error("Unauthorized");
    }

    // Join sessions and users to get user data from token
    const [result] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.name, token))
      .limit(1);

    if (!result) {
      throw new Error("Unauthorized");
    }

    return result;
  }
}

export const usersService = new UsersService();
