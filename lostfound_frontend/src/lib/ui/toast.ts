import toast from 'react-hot-toast';

export function toastSuccess(message: string) {
  toast.success(message, { duration: 3000 });
}

export function toastError(message: string) {
  toast.error(message, { duration: 5000 });
}

export function toastInfo(message: string) {
  toast(message, { duration: 3000 });
}
