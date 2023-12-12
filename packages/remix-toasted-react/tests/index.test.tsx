import React from 'react';
import { describe, expect, test, vi } from 'vitest'; //
import { createRemixStub } from '@remix-run/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { Toast } from '../index';

// waitFor -> returns promise that you can await in your test to wait for your react app to be ready
// getByText -> throws error if element is not found
// queryByText -> does not throw, element may be null
// findByText -> waits for element to appear on the screen, throws if not there

describe('Toast', () => {
  test('it renders a toast when the loader toast data is provided', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast />,
        loader() {
          return { toast: { message: 'hello', type: 'success' } };
        },
      },
    ]);

    render(<RemixStub initialEntries={['/']} />);

    await screen.findByText('hello');
  });

  test('it does not render a toast when there is no loader toast data', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast />,
        loader() {
          return { toast: null };
        },
      },
    ]);

    render(<RemixStub initialEntries={['/']} />);

    const toast = await screen.queryByText('hello');
    expect(toast).toBeNull();
  });

  test.only('it can be dismissed when dismissible is true', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast dismissible />,
        loader() {
          return { toast: { message: 'hello', type: 'success' } };
        },
      },
    ]);

    render(<RemixStub initialEntries={['/']} />);
    await screen.findByText('X');

    fireEvent.submit(screen.getByTestId('dismissForm'));

    await waitFor(() => {
      const button =  screen.getByTestId('dismissButton');
      // check if has css class remix-toasted-dismissed
      expect(button.classList.contains('remix-toasted-dismissed')).toBe(true);
    }, { timeout: 100000000 });
  });

  test('it can not be dismissed when dismissible is false', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast dismissible={false} />,
        loader() {
          return { toast: { message: 'hello', type: 'success' } };
        },
      },
    ]);
    render(<RemixStub initialEntries={['/']} />);
    // await for text hello to appear (so we can be certain that toast is there)
    await screen.findByText('hello');

    const button = screen.queryByTestId('dismissButton');
    expect(button).toBeNull();
  });

  test('it can have a custom styles set when passed a className', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast className="bg-red-900" />,
        loader() {
          return { toast: { message: 'hello', type: 'success' } };
        },
      },
    ]);

    render(<RemixStub initialEntries={['/']} />);

    await screen.findByText('hello');
    expect(screen.getByTestId('toast').classList.contains('bg-red-900')).toBe(true);
  });

  test('it can have a custom dismiss component', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast dismissible dismissElement={<span>something random</span>} />,
        loader() {
          return { toast: { message: 'hello', type: 'success' } };
        },
      },
    ]);

    render(<RemixStub initialEntries={['/']} />);

    await screen.findByText('hello');
    expect(screen.getByTestId('dismissButton').innerHTML).toBe('<span>something random</span>');
  });

  test('it can have a custom dismiss text', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast dismissible dismissElement="close" />,
        loader() {
          return { toast: { message: 'hello', type: 'success' } };
        },
      },
    ]);

    render(<RemixStub initialEntries={['/']} />);

    await screen.findByText('hello');
    expect(screen.getByTestId('dismissButton').innerHTML).toBe('close');
  });

  test('it can have a custom aria-label for dismiss', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast dismissAriaLabel="close" />,
        loader() {
          return { toast: { message: 'hello', type: 'success' } };
        },
      },
    ]);

    render(<RemixStub initialEntries={['/']} />);

    await screen.findByText('hello');
    expect(screen.getByTestId('dismissButton').getAttribute('aria-label')).toBe('close');
  });

  test('it can have a custom fade out time set', () => {});
  test('it can have custom children passed to it', () => {});

  test("it doesn't fade out when fadeOut is `false`", async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast fadeOut={false} />,
        loader() {
          return { toast: { message: 'hello', type: 'success' } };
        },
      },
    ]);

    render(<RemixStub initialEntries={['/']} />);

    function executeAfterSixSeconds(func) {
      setTimeout(func, 6000);
    }

    vi.useFakeTimers();
    await screen.findByText('hello');
    executeAfterSixSeconds(() => screen.findByText('hello'));
    vi.runAllTimers();
    vi.restoreAllMocks();
  });

  test('it can be dismissed even when fade out is `false`', () => {});
  test('it can take null values without causing error', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: () => <Toast />,
        loader() {
          return { toast: { message: null, type: null } };
        },
      },
    ]);
    render(<RemixStub initialEntries={['/']} />);
    await expect(() => screen.getByText('Modal title')).toThrow();
  });
  test('it can be dismissed without JS', () => {});
});
