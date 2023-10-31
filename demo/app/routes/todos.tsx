import { type ActionFunctionArgs } from '@remix-run/node';
import { Form, useFetcher, useLoaderData, useNavigation } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { db } from '~/db.server';
import { redirectWithToast } from '~/utils.server';

const intents = {
  delete: 'Delete' as const,
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  // Delete
  if (typeof intent === 'string' && intent === intents.delete) {
    const id = formData.get('id');
    console.log('id', id);
    if (!id || typeof id !== 'string') {
      throw new Response('Bad Request', { status: 400 });
    }
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new Response('Bad Request', { status: 400 });
    }
    db.todos.delete(idNumber);
    return redirectWithToast('/todos', { message: 'Todo deleted', type: 'success' });
  }

  // Create
  const todo = formData.get('new_todo');
  if (!todo || typeof todo !== 'string') {
    throw new Response('Bad Request', { status: 400 });
  }
  db.todos.create(todo);
  return redirectWithToast('/todos', { message: 'Todo created', type: 'success' });
}

export function loader() {
  return { todos: db.todos.readAll() };
}

export default function Component() {
  const data = useLoaderData<typeof loader>();
  const ref = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (ref.current && navigation.state === 'idle') {
      ref.current.reset();
    }
  }, [navigation.state]);

  return (
    <>
      <div>
        <h1>TODOs</h1>
        <ul>
          {data.todos.map((todo) => {
            return <ToDoItem key={todo.id} todo={todo} />;
          })}
        </ul>
        <Form ref={ref} method="post">
          <input type="text" name="new_todo" />
          <button type="submit">Add</button>
        </Form>
      </div>
    </>
  );
}

function ToDoItem({ todo }: { todo: { id: number; message: string } }) {
  const fetcher = useFetcher();
  return (
    <li>
      {todo.message}
      <fetcher.Form method="POST">
        <input type="hidden" name="id" value={todo.id} />
        <button name="intent" value={intents.delete}>
          Delete
        </button>
      </fetcher.Form>
    </li>
  );
}
