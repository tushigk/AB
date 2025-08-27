export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;

  if (typeof err === "object" && err && "error" in err) {
    return (err as { error?: { message?: string } }).error?.message || "Unknown error";
  }

  return "Unknown error";
}
