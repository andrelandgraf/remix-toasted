import { createToastFactory } from './toast.server';

const { flashToastMessage, consumeToastMessage, redirectWithToast } = createToastFactory<'success' | 'error'>();

export { consumeToastMessage, flashToastMessage, redirectWithToast };
