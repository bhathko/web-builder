export function extractErrorMessage(
  error: unknown,
  fallback = 'An error occurred',
): string {

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
}
