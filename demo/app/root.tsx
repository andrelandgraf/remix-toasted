import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import { Toast } from './toast';
import { consumeToastMessage } from './utils.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const [toast, headers] = await consumeToastMessage(request);
  return json({ toast }, { headers });
}

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
        <Toast dismissible className={({ type }) => (type === 'success' ? 'bg-green-500 text-white' : 'not-success')} />
      </body>
    </html>
  );
}
