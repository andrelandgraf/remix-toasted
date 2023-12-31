import type {
  Cookie,
  CookieParseOptions,
  CookieSerializeOptions,
  CookieSignatureOptions,
} from '@remix-run/server-runtime';
import { createCookieFactory, createCookieSessionStorageFactory, redirect } from '@remix-run/server-runtime';

type CookieData<ToastType> = {
  message: string;
  type?: ToastType;
};

// copied from @remix-run/server-runtime
type CookieOptions =
  | Cookie
  | (CookieParseOptions &
      CookieSerializeOptions &
      CookieSignatureOptions & {
        name?: string | undefined;
      })
  | undefined;

export function createToastFactory<ToastType extends string>(cookieParseOptions?: CookieOptions) {
  const createCookieFn = createCookieFactory({ sign: async (v) => v, unsign: async (v) => v });
  const createCookieSessionStorageFn = createCookieSessionStorageFactory(createCookieFn);
  const { commitSession, getSession } = createCookieSessionStorageFn({
    cookie: {
      name: 'remix-toasted',
      maxAge: 10, // 10 seconds
      ...cookieParseOptions,
    },
  });

  const flashToastMessage = async ({ message, type }: CookieData<ToastType>, headers = new Headers()) => {
    const session = await getSession();
    session.flash('message', message);
    session.flash('type', type);
    headers.set('Set-Cookie', await commitSession(session));
    return headers;
  };
  return {
    flashToastMessage,
    consumeToastMessage: async (
      request: Request,
      headers = new Headers(),
    ): Promise<[cookieData: CookieData<ToastType> | undefined, headers: Headers]> => {
      const session = await getSession(request.headers.get('Cookie'));
      const message = session.get('message');
      const type = session.get('type');
      headers.set('Set-Cookie', await commitSession(session));
      if (message && typeof message === 'string') {
        return [{ message, type }, headers];
      }
      return [undefined, headers];
    },
    redirectWithToast: async (path: string, cookeData: CookieData<ToastType>, headers = new Headers()) => {
      headers = await flashToastMessage(cookeData, headers);
      return redirect(path, { headers });
    },
  };
}
