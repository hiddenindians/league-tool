// src/hooks/prevent-duplicate-email.hook.ts
import type { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';

/**
 * A Feathers HookFunction that throws if `context.data.email` already exists.
 */
export async function preventDuplicateEmails(context: HookContext) {
  const { data, app } = context;
  const email = (data.email as string || '').trim().toLowerCase();

  if (email) {
    // Look for any users with the same email
    const existing = await app.service('users').find({
      query: { email },
      paginate: false
    });

    if (Array.isArray(existing) && existing.length > 0) {
      throw new BadRequest('A user with that email already exists.');
    }
  }

  // Always return context
  return context;
}