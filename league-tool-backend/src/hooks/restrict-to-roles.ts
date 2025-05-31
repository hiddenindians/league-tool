import { HookContext } from '@feathersjs/feathers';
import { Forbidden } from '@feathersjs/errors';

/**
 * Restrict access to service methods based on user roles.
 * Use as a before hook in your service hooks.
 *
 * @param allowedRoles - List of roles that are permitted to perform the action
 * @returns A hook function that throws Forbidden if the user's role isn't allowed
 */
export function restrictToRoles(...allowedRoles: string[]) {
  return async (context: HookContext) => {
    const { params, method } = context;

    // Ensure the request is authenticated
    if (!params.user) {
      throw new Forbidden('You must be authenticated to perform this action.');
    }

    const { role } = params.user as { role: string };

    // Check if the user's role is one of the allowed roles
    if (!allowedRoles.includes(role)) {
      throw new Forbidden(
        `Your role '${role}' is not permitted to call '${method}'.`
      );
    }

    return context;
  };
}
