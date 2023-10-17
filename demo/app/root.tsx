import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import { Toast } from './toast';

export function loader({ request }: LoaderFunctionArgs) {
  const cookies = request.headers.get('Cookie');
  return json(
    {
      toast: cookies
        ? {
            message: cookies
              ? cookies
                  .split(';')
                  .find((c) => c.trim().startsWith('toast='))
                  ?.split('=')[1]
              : undefined,
          }
        : undefined,
    },
    {
      headers: {
        'Set-Cookie': 'toast=; Path=/; SameSite=Strict; Max-Age=0',
      },
    },
  );
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
        <Toast />
      </body>
    </html>
  );
}
