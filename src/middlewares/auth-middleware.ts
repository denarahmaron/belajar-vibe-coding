import { Elysia } from "elysia";
import { usersService } from "../services/users-service";

export const authMiddleware = (app: Elysia) =>
  app
    .derive(async ({ headers }) => {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { user: null };
      }

      const token = authHeader.replace("Bearer ", "");
      
      try {
        const user = await usersService.getCurrentUser(token);
        return { user };
      } catch (error) {
        return { user: null };
      }
    })
    .onBeforeHandle(({ user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized: Invalid or missing token" };
      }
    });
