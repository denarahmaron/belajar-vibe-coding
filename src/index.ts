import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello World")
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);