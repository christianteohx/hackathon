type FlashMessageProps = {
  error?: string | null;
  success?: string | null;
};

export function FlashMessage({ error, success }: FlashMessageProps) {
  if (!error && !success) {
    return null;
  }

  return (
    <div
      className={`rounded border px-4 py-3 text-sm ${
        error
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {error ?? success}
    </div>
  );
}
