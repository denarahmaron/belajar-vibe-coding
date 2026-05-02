import { Elysia, t } from "elysia";
import { todoService } from "../services/todo-service";
import { usersService } from "../services/users-service";

export const todoRoute = new Elysia({ prefix: "/api" })
  // Kita buat grup route yang butuh pengecekan token
  .post("/todos", async ({ body, headers, set }) => {
    try {
      // 1. Ambil token dari header 'Authorization'
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }
      const token = authHeader.replace("Bearer ", "");

      // 2. Cek siapa user-nya berdasarkan token
      const user = await usersService.getCurrentUser(token);

      // 3. Kalau user ada, baru kita buatkan Todo-nya
      return await todoService.createTodo(body.title, user.id);
      
    } catch (error: any) {
      set.status = 401;
      return { error: error.message };
    }
  }, {
    body: t.Object({
      title: t.String()
    })
  })
  .get("/todos", async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }
      const token = authHeader.replace("Bearer ", "");

      const user = await usersService.getCurrentUser(token);
      
      // Ambil daftar todo milik user ini
      const list = await todoService.getTodos(user.id);
      return { data: list };

    } catch (error: any) {
      set.status = 401;
      return { error: error.message };
    }
  })
  .delete("/todos/:id", async ({ params, headers, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }
      const token = authHeader.replace("Bearer ", "");

      const user = await usersService.getCurrentUser(token);
      
      // Hapus todo berdasarkan ID dari URL (:id)
      return await todoService.deleteTodo(Number(params.id), user.id);

    } catch (error: any) {
      set.status = 401;
      return { error: error.message };
    }
  })
  .patch("/todos/:id", async ({ params, body, headers, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }
      const token = authHeader.replace("Bearer ", "");

      const user = await usersService.getCurrentUser(token);
      
      return await todoService.updateTodo(Number(params.id), user.id, body);

    } catch (error: any) {
      set.status = 401;
      return { error: error.message };
    }
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      isDone: t.Optional(t.Number())
    })
  });
