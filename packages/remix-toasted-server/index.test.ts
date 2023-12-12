import { createCookieSessionStorageFactory } from '@remix-run/server-runtime';
import type { Mock } from 'vitest';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { createToastFactory } from './index';

// mocking -> Something outside of the scope of your test that you want to control, and let it return what we want
//            to fit our current test scenario.
// stubbing -> We replace the code with a test helper that returns what we want to fit our current test scenario.
// spying -> We actual run the code but we wrap it with test helpers that observe what the code is doing (ins and outs, and how often called)
// you test a specific scenario

vi.mock('@remix-run/server-runtime', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import('@remix-run/server-runtime')>();
  return {
    ...mod,
    createCookieSessionStorageFactory: vi.fn().mockReturnValue(() => ({
      commitSession: vi.fn(),
      getSession: vi.fn(),
    })),
  };
});

describe('createToastFactory', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('creates toast functions', () => {
    const value = createToastFactory();
    expect(value.consumeToastMessage).toBeTypeOf('function');
    expect(value.flashToastMessage).toBeTypeOf('function');
    expect(value.redirectWithToast).toBeTypeOf('function');
  });

  test('creates session cookie with specified options', () => {
    const createCookieSessionStorageFn = vi.fn().mockReturnValue({
      commitSession: vi.fn(),
      getSession: vi.fn(),
    });
    (createCookieSessionStorageFactory as Mock).mockReturnValueOnce(createCookieSessionStorageFn);
    createToastFactory({ httpOnly: true, path: '/test', sameSite: 'strict' });
    expect(createCookieSessionStorageFn).toHaveBeenCalledWith({
      cookie: {
        httpOnly: true,
        path: '/test',
        sameSite: 'strict',
        maxAge: 10,
        name: 'remix-toasted',
      },
    });
  });

  test('allows override of default session cookie options', () => {
    const createCookieSessionStorageFn = vi.fn().mockReturnValue({
      commitSession: vi.fn(),
      getSession: vi.fn(),
    });
    (createCookieSessionStorageFactory as Mock).mockReturnValueOnce(createCookieSessionStorageFn);
    createToastFactory({ httpOnly: true, maxAge: 1000, name: 'test' });
    expect(createCookieSessionStorageFn).toHaveBeenCalledWith({
      cookie: {
        httpOnly: true,
        maxAge: 1000,
        name: 'test',
      },
    });
  });
});
