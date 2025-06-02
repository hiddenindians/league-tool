import { randomBytes } from 'crypto';
import type { HookContext } from '../declarations';

function makeRandomCode(len = 32): string {
  return  (randomBytes(len).toString('hex').toUpperCase())
}

export const generateUniqueCode = async (context: HookContext) => {
  // 1) Generate a new code and check for collisions in a loop:
  let code: string;
  let existing: any[];

  do {
    code = makeRandomCode(32); // 32 bytes → 64-hex chars (256 bits)
    // “find” returns an object with .data = [ … ] in REST, so we pull response.data
    const result = await context.app.service('codes').find({
      query: { code }
    });
    existing = Array.isArray((result as any).data)
      ? (result as any).data
      : (result as any);
  } while (existing.length !== 0);

  // 2) Now “code” is guaranteed unique. Attach it to context.data:
  context.data.code = code;

  // 3) Fill in the rest of the fields:
  context.data.createdAt = new Date();
  context.data.used = false;

  if (context.id) {
    context.data.redeemedBy = context.id;
  }

  return context;
};