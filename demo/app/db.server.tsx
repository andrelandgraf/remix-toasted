type Todo = {
  id: number;
  message: string;
};

const todos: Todo[] = [];

console.log('test');

export const db = {
  todos: {
    create(message: string) {
      const id = todos.length;
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
      todos.splice(id, 1);
    },
    readAll() {
      return todos;
    },
  },
};
