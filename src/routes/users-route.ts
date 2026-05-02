import { Elysia, t } from "elysia";
import { usersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" })
  .post("/users", async ({ body, set }) => {
    try {
      return await usersService.registerUser(body);
    } catch (error: any) {
      set.status = 400;
      return { error: error.message };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String()
    })
  })
  .post("/users/login", async ({ body, set }) => {
    try {
      const token = await usersService.login(body);
      return { data: token };
    } catch (error: any) {
      set.status = 401;
      return { error: error.message };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  })
  .get("/current", async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }

      const token = authHeader.replace("Bearer ", "");
      const user = await usersService.getCurrentUser(token);
      return { data: user };
    } catch (error: any) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  });
