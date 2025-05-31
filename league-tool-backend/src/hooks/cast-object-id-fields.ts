import { ObjectId } from 'mongodb';
import type { HookContext } from '@feathersjs/feathers';

export const castObjectIdFields = (fields: string[]) => {
  return async (context: HookContext) => {
    const data = context.data;
    if (!data || typeof data !== 'object') {
      console.log('[castObjectIdFields] No data object found in context.');
      return context;
    }

    const convert = (target: any, field: string, scope: string) => {
      const value = target?.[field];
      if (
        typeof value === 'string' &&
        /^[a-f\d]{24}$/i.test(value)
      ) {
        target[field] = new ObjectId(value);
        console.log(`[castObjectIdFields] Converted ${scope}.${field} to ObjectId(${value})`);
      } else if (value !== undefined) {
        console.log(`[castObjectIdFields] Skipped ${scope}.${field}: Not a valid ObjectId string`, value);
      }
    };

    console.log('[castObjectIdFields] Incoming data:', JSON.stringify(data, null, 2));

    // Check top-level fields
    for (const field of fields) {
      convert(data, field, 'data');
    }

    // Handle $push.bonus_codes_used
    if (data.$push?.bonus_codes_used) {
      for (const field of fields) {
        convert(data.$push.bonus_codes_used, field, '$push.bonus_codes_used');
      }
    }

    // Handle $push.redemptions.$each
    if (data.$push?.redemptions?.$each) {
      data.$push.redemptions.$each.forEach((entry: any, index: number) => {
        for (const field of fields) {
          convert(entry, field, `$push.redemptions.$each[${index}]`);
        }
      });
    }

    return context;
  };
};