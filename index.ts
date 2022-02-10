import express, { Request, Response } from "express";
import fetch from 'node-fetch';
import cors from 'cors';

// rest of the code remains same
const app = express();
const PORT = 8000;

app.use(cors())


const TODO_API_BASE = 'https://jsonplaceholder.typicode.com/todos/';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
}

async function fetchTodo(id: number): Promise<Todo|null> {
  const apiRes = await fetch(`${TODO_API_BASE}/${id}`)
  const todo = await apiRes.json()
  return todo.id ? todo : null;
}

app.get('/todos/:count', async (req: Request, res: Response) => {
  const count = Number(req.params.count)
  const promises = []
  for (let i = 0; i < count; i++) {
    promises.push(fetchTodo(i+1))
  }
  const results = await Promise.allSettled(promises)
  const todos = results.map(result => result.status === 'fulfilled' ? result.value : null).filter(val => val)

  res.send(JSON.stringify(todos))
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});