import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { db } from '~/db.server';

const intents = {
  delete: 'Delete' as const,
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  if (typeof intent === 'string' && intent === intents.delete) {
    const id = formData.get('id');
    if (!id || typeof id !== 'string') {
      throw new Response('Bad Request', { status: 400 });
    }
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new Response('Bad Request', { status: 400 });
    }
    db.todos.delete(idNumber);
    return { error: false };
  }
  const todo = formData.get('new_todo');
  if (!todo || typeof todo !== 'string') {
    throw new Response('Bad Request', { status: 400 });
  }
  return db.todos.create(todo);
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
    <div>
      <h1>TODOs</h1>
      <ul>
        {data.todos.map((todo) => {
          return (
            <li key={todo.id}>
              {todo.message}
              <Form method="POST">
                <input type="hidden" name="id" value={todo.id} />
                <button name="intent" value={intents.delete}>
                  Delete
                </button>
              </Form>
            </li>
          );
        })}
      </ul>
      <Form ref={ref} method="post">
        <input type="text" name="new_todo" />
        <button type="submit">Add</button>
      </Form>
    </div>
  );
}
