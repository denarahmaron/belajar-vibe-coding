import { Elysia, t } from "elysia";
import { todoService } from "../services/todo-service";
import { authMiddleware } from "../middlewares/auth-middleware";

export const todoRoute = new Elysia({ prefix: "/api" })
  .use(authMiddleware)
  .post("/todos", async ({ body, user }) => {
    return await todoService.createTodo(body.title, user.id);
  }, {
    body: t.Object({
      title: t.String()
    })
  })
  .get("/todos", async ({ user }) => {
    const list = await todoService.getTodos(user.id);
    return { data: list };
  })
  .delete("/todos/:id", async ({ params, user }) => {
    return await todoService.deleteTodo(Number(params.id), user.id);
  })
  .patch("/todos/:id", async ({ params, body, user }) => {
    return await todoService.updateTodo(Number(params.id), user.id, body);
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      isDone: t.Optional(t.Number())
    })
  });
