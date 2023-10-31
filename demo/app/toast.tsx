import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

type ToastType = 'error' | 'success' | 'info' | 'warning' | string;

type ToastProps = {
  dismissible?: boolean;
  fadeOut?: boolean;
  fadeOutAfter?: number;
  className?: string | ((params: { type: ToastType }) => string);
};

type ToastLoaderData = {
  toast?: {
    message: string;
    type: ToastType;
  };
};

export function Toast({ dismissible, className }: ToastProps) {
  const data = useLoaderData<ToastLoaderData>();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (data && data.toast) {
      setDismissed(false);
    }
  }, [data]);

  if (!data || !data.toast || dismissed) return null;
  return (
    <div
      className={`remix-toasted-${data.toast.type} ${
        typeof className === 'function' ? className({ type: data.toast.type }) : className
      }`}
      style={{
        position: 'fixed',
        bottom: '5vh',
        right: '5vw',
        backgroundColor: 'red',
        color: 'white',
        padding: '10px',
      }}
    >
      {data.toast.message}
      {dismissible && (
        <>
          <form
            method="GET"
            onSubmit={(e) => {
              e.preventDefault();
              setDismissed(true);
            }}
          >
            <button type="submit" aria-label="Dismiss">
              {' '}
              X
            </button>
          </form>
        </>
      )}
    </div>
  );
}
