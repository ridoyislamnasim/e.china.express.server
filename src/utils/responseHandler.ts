export function responseHandler<T>(statusCode: number, message: string, data?: T) {
  return {
    statusCode,
    status: 'success',
    message,
    ...(data && { data }),
  };
}
