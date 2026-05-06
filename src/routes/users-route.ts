import { Elysia, t } from "elysia";
import { usersService } from "../services/users-service";
import { authMiddleware } from "../middlewares/auth-middleware";

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
  .use(authMiddleware)
  .get("/current", async ({ user }) => {
    return { data: user };
  });
