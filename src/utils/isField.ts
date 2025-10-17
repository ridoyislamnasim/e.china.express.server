export function isField<T>(field: T, fieldName: string): Record<string, T> | undefined {
  return field ? { [fieldName]: field } : undefined;
}
