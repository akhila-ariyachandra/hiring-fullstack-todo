import { toast } from "sonner";

// Awaits a server action that resolves to whether it succeeded, shows a
// success or error toast, and returns the outcome. A thrown error (e.g. the
// API being unreachable) counts as a failure.
export const toastResult = async (
  action: Promise<boolean>,
  messages: { success: string; error: string },
) => {
  const ok = await action.catch(() => false);

  if (ok) {
    toast.success(messages.success);
  } else {
    toast.error(messages.error);
  }

  return ok;
};
