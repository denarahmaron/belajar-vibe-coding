import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { usersRoute } from "./routes/users-route";
import { todoRoute } from "./routes/todo-route";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello World")
  .get("/health", () => ({ status: "ok" }))
  .use(usersRoute)
  .use(todoRoute)
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);