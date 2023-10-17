type Todo = {
  id: number;
  message: string;
};

let todos: Todo[] = [];

export const db = {
  todos: {
    create(message: string) {
      const id = Math.round(1000 * Math.random());
      todos.push({ id, message });
      return id;
    },
    read(id: number) {
      return todos[id];
    },
    update(id: number, message: string) {
      todos[id].message = message;
    },
    delete(id: number) {
      todos = todos.filter((todo) => todo.id !== id);
    },
    readAll() {
      return todos;
    },
  },
};
