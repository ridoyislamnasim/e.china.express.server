import { Request } from "express";
import { UnauthorizedError } from "./errors";

/**
 * Extract authenticated user ID from request
 * @param req - Express request object
 * @returns user ID
 * @throws UnauthorizedError if user not authenticated
 */
export const getAuthUserId = (req: Request): number => {
  const userId =
    (req as any).user?.user_info_encrypted?.id || (req as any).user?.id;

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  return userId;
};

/**
 * Extract authenticated user (full object)
 * @param req - Express request object
 * @returns user object
 */
export const getAuthUser = (req: Request): any => {
  const user = (req as any).user;

  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  return user.user_info_encrypted || user;
};

/**
 * Safely get user ID without throwing error
 * @param req - Express request object
 * @returns user ID or null
 */
export const getAuthUserIdSafe = (req: Request): number | null => {
  return (
    (req as any).user?.user_info_encrypted?.id || (req as any).user?.id || null
  );
};
