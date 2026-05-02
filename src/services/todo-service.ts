import { db } from "../db";
import { todos } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class TodoService {
  // Menambah Todo baru
  async createTodo(title: string, userId: number) {
    await db.insert(todos).values({
      title,
      userId,
    });
    return { data: "OK" };
  }

  // Mengambil semua Todo milik User tertentu
  async getTodos(userId: number) {
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId));
    
    return result;
  }

  // Menghapus Todo
  async deleteTodo(id: number, userId: number) {
    await db.delete(todos)
      .where(
        and(eq(todos.id, id), eq(todos.userId, userId))
      );
    
    return { data: "OK" };
  }

  // Mengupdate Todo (Judul atau Status)
  async updateTodo(id: number, userId: number, data: { title?: string, isDone?: number }) {
    await db.update(todos)
      .set(data)
      .where(
        and(eq(todos.id, id), eq(todos.userId, userId))
      );
    
    return { data: "OK" };
  }
}

export const todoService = new TodoService();
