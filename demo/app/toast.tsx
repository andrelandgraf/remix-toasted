import { useLoaderData } from '@remix-run/react';

type ToastProps = {
  onDismiss?: () => void;
};

type ToastLoaderData = {
  toast?: {
    message: string;
  };
};

export function Toast({ onDismiss }: ToastProps) {
  const data = useLoaderData<ToastLoaderData>();
  if (!data || !data.toast) return null;
  return (
    <div
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
      {onDismiss && (
        <button aria-label="Dismiss" onClick={onDismiss}>
          {' '}
          X
        </button>
      )}
    </div>
  );
}
