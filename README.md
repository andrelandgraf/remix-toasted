# Remix Toasted

![Toast notifications](/assets/simple-demo.gif)

Remix Toasted is a full-stack implementation of toast notifications for [Remix](https://remix.run/), using HTTP cookies and Remix `loader` functions.

<img src='https://img.shields.io/npm/l/remix-toasted-react'/>

### When to use this package?

In Remix, we work with both a server environment and a client environment. Traditionally in React, you would handle toast notifications purely client side:

```tsx
const { addToast } = useToasts();
const addTodoQuery = useMutation(addTodo, {
  onSuccess: () => {
    addToast("Todo added successfully", { type: "success" });
  },
  onError: () => {
    addToast("Something went wrong", { type: "error" });
  },
});
```

However, in Remix, you define your [`action` functions](https://remix.run/docs/en/main/route/action) not on the client but on the server. If we want our toast notifications to be defined where the action is defined, we need to do it on the server. This is where Remix Toasted comes in. Remix Toasted provided both a server-side and a React package to handle both sides of the toast notification process. It is meant to be customizable and flexible, so you can use it in any way you want.

```tsx
import { flashToastMessage, redirectWithToast } from "remix-toasted-server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const todo = formData.get("new_todo");
  try {
    const { id } = await db.todos.create(todo);
    return redirectWithToast(`/todo/${id}`, {
      message: "Todo created",
      type: "success",
    });
  } catch (error) {
    const headers = flashToastMessage({
      message: "Something went wrong",
      type: "error",
    });
    return json({ error: "Something went wrong" }, { headers });
  }
}
```

## Installation

Remix Toast consists of two packages: `remix-toasted-server` and `remix-toasted-react`. You need to install both of them:

```bash
npm i remix-toasted-server remix-toasted-react
```

link to remix-toasted-server: https://www.npmjs.com/package/remix-toasted-server <img src="https://img.shields.io/npm/v/remix-toasted-server">
link to remix-toasted-react: https://www.npmjs.com/package/remix-toasted-react <img src="https://img.shields.io/npm/v/remix-toasted-react">

## Usage

The `remix-toasted-server` package abstracts interactions with the HTTP headers to write and read your toasted messages with cookies. The `remix-toasted-react` package offers a React component that consumes the data from the server (using Remix's loader data) to display the toasts on the client.

### Quick start

#### 1. Configure the cookie

Create a small `toast.server.ts` utils file to configure the toast notification cookie:

```ts
// app/utils/toast.server.ts
import { createToastFactory } from "./toast.server";

const { flashToastMessage, consumeToastMessage, redirectWithToast } =
  createToastFactory<"success" | "error">();

export { consumeToastMessage, flashToastMessage, redirectWithToast };
```

You can pass your cookie config data to `createToastFactory`. Also, use the TypeScript generic to specify the type of toast messages you want to use. This will be used to type the `type` property in the `redirectWithToast` and `flashToastMessage` functions.

#### 2. Add toast message to headers in `action`

When you submit a Form (non-get), Remix's `action` function performs a mutation. Here, we can write a toast message to a HTTP cookie to persist it across following request-response flows. Remix Toasted provides `redirectWithToast` and `flashToastMessage` to write toast messages to the headers. You can use these functions in your `action` functions to write toast messages to the headers.

Use `redirectWithToast` to write a toast message to the headers and redirect to a new route:

```ts
// app/routes/todos/delete
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirectWithToast, flashToastMessage } from "remix-toasted-server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id");

  await db.todos.delete(id);
  return redirectWithToast("/todos", {
    message: "Deleted todo!",
    type: "success",
  });
}
```

Use `flashToastMessage` to write a toast message to a JSON response:

```ts
// app/routes/todos/delete
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirectWithToast, flashToastMessage } from "remix-toasted-server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id");

  await db.todos.delete(id);
  const headers = await flashToastMessage("/todos", {
    message: "Deleted todo!",
    type: "success",
  });
  return json({}, headers);
}
```

#### 3. Read toast header in root `loader`

After an `action` function responds, it triggers a `loader` revalidation step in Remix. You can find more information in the Remix docs: https://remix.run/docs/en/main/discussion/data-flow. After we write the toast message to the cookie in the `action` function, we can then read it in a `loader` function (for instance the root `loader`). This is how we pass the cookie toast value to our React app.

In your root `loader` function, read the toast message from the cookie and pass it to your React app:

```ts
// app/root.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { consumeToastMessage } from "remix-toasted-server";

export async function loader({ request }: LoaderFunctionArgs) {
  const [toast, headers] = await consumeToastMessage(request);
  return json({ toast }, { headers });
}
```

Make sure to call the property `toast`. This is the name the remix-toasted-react `Toast` component will look for in the loader data. Pass the updated `headers` to the `json` function to remove the cookie from the response. This ensures that each toast notification is only shown once.

#### 4. Render toast component in root component

Add the `Toast` component from `react-toasted-react` to `root.tsx` (or the route where you added the `loader` logic). This allows the toast message to be rendered.

```diff
// app/root.tsx
...
+ import { Toast } from "remix-toasted-react";
...

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
+       <Toast />
      </body>
    </html>
  );
}
```

#### 5. Using the default styles

Remix Toasted comes with default styling for the toast notifications. You can use it by importing the `remix-toasted-react/index.css` file in your root component:

```ts
// app/root.tsx
import toastCss from "remix-toasted-react/index.css";
import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: toastCss },
];
```

Note that you probably want to remove it and write your own styles! More information on how to do that below.

Awesome! Just like that, you implemented a full-stack toast notification system in Remix. 🎉

## Specification

### Toast component

You can pass the following optional props to the `Toast` component:

| option           | type                                                                      | default     | description                                                                               |
| ---------------- | ------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| fadeOut          | `boolean`                                                                 | `true`      | Sets whether the toast message can fade out                                               |
| fadeOutAfter     | `number`                                                                  | `5000`      | Milliseconds until the toast fades out                                                    |
| dismissible      | `boolean`                                                                 | `true`      | Whether the toast is dismissible                                                          |
| dismissElement   | `ReactNode`                                                               | `'X'`       | A `ReactNode` for the dismiss element                                                     |
| dismissAriaLabel | `string`                                                                  | `'dismiss'` | An aria label for the dismiss element                                                     |
| className        | `string` or `((params: { type: ToastType }) => string)`                   | `''`        | Any class names or a function                                                             |
| children         | `(message: string, type: ToastType, dismissNode: ReactNode) => ReactNode` | `undefined` | A function that receives a `message`, `type`, and `dismissNode` and returns a `ReactNode` |

### Adding classes

You can style the `Toast` component by passing a `className` prop. You can either pass a string or a function that returns a string. The function receives an object with the `type` value you defined in the `redirectWithToast` or `flashToastMessage` function. This allows you to style the toast based on the type of toast message.

```tsx
className={({ type }) => (type === 'success' ? 'bg-green-500 text-white' : 'not-success')}
```
