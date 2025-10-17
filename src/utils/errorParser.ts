
import { Prisma } from '@prisma/client';

export function parsePostgreSQLError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errors: Record<string, string> = {};

  // Handle Prisma validation errors (e.g., unknown argument)
  if (error.message && error.message.includes('Unknown argument')) {
    // Try to extract the unknown argument and suggestion from the error message
    const match = error.message.match(/Unknown argument `(\w+)`. Did you mean `(\w+)`\?/);
    if (match) {
      const [, unknownArg, suggestion] = match;
      return {
        status: 'error',
        message: `Unknown argument '${unknownArg}'. Did you mean '${suggestion}'? Please check your Prisma schema and payload.`,
      };
    }
    // Fallback for other Prisma validation errors
    return {
      status: 'error',
      message: error.message,
    };
  }
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        const fields = error.meta?.target; // Get the fields causing the error
        const model = error.meta?.model; // Get the model causing the error
        if (Array.isArray(fields)) {
          fields.forEach((field) => {
            errors[field] = `${field} in ${model || 'the database'} must be unique. This value already exists.`;
          });
        } else if (typeof fields === 'string') {
          errors[fields] = `${fields} in ${model || 'the database'} must be unique. This value already exists.`;
        }
        return {
          status: 'error',
          message: Array.isArray(fields)
            ? fields.map((field) => `${field} in ${model || 'the database'} must be unique. This value already exists.`).join(', ')
            : `${fields} in ${model || 'the database'} must be unique. This value already exists.`,
          errors,
        };

      case 'P2025': // Record not found
        return {
          status: 'error',
          message: `The requested record was not found in ${error.meta?.model || 'the database'}.`,
        };

      case 'P2003': // Foreign key constraint violation
        return {
          status: 'error',
          message: `Foreign key constraint failed in ${error.meta?.model || 'the database'}. Please check related data.`,
        };

      default:
        return {
          status: 'error',
          message: `An unexpected error occurred in ${error.meta?.model || 'the database'}: ${error.message}`,
        };
    }
  } else if (error.message) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  // Default error response for unknown errors
  return {
    status: 'error',
    message: 'An unexpected error occurred',
  };
}