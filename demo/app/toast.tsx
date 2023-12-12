import { useLoaderData } from '@remix-run/react';
import type { HTMLAttributes, ReactNode } from 'react';
import { useEffect, useState } from 'react';

type ToastType = string;

type ToastProps = Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'> & {
  dismissible?: boolean;
  dismissElement?: ReactNode;
  dismissAriaLabel?: string;
  fadeOut?: boolean;
  fadeOutAfter?: number;
  className?: string | ((params: { type: ToastType }) => string);
  children?: (message: string, type: ToastType, dismissNode: ReactNode) => ReactNode;
};

type ToastLoaderData = {
  toast?: {
    message: string;
    type: ToastType;
  };
};

export function Toast({
  dismissible = true,
  className,
  dismissElement = 'X',
  dismissAriaLabel = 'dismiss',
  fadeOut = true,
  fadeOutAfter = 5000,
  children,
  ...props
}: ToastProps) {
  const data = useLoaderData<ToastLoaderData>();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (data && data.toast) {
      setDismissed(false);
    }
  }, [data]);

  useEffect(() => {
    if (fadeOut && data.toast) {
      const timeout = window.setTimeout(() => {
        setDismissed(true);
      }, fadeOutAfter);
      return () => {
        window.clearTimeout(timeout);
      };
    }
  }, [data, fadeOut, fadeOutAfter]);

  if (!data || !data.toast) return null;

  const dismissNode = dismissible && (
    <>
      <form
        method="GET"
        onSubmit={(e) => {
          e.preventDefault();
          setDismissed(true);
        }}
      >
        <button type="submit" aria-label={dismissAriaLabel}>
          {dismissElement}
        </button>
      </form>
    </>
  );

  return (
    <div
      {...props}
      className={`remix-toasted-toast remix-toasted-${data.toast.type} ${dismissed && 'remix-toasted-dismissed'} ${
        typeof className === 'function' ? className({ type: data.toast.type }) : className
      }`}
    >
      {children ? (
        children(data.toast.message, data.toast.type, dismissNode)
      ) : (
        <>
          {data.toast.message}
          {dismissNode}
        </>
      )}
    </div>
  );
}
