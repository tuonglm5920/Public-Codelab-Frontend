import type { ActionFunctionArgs, TypedResponse } from '~/overrides/remix';
import { json, redirect } from '~/overrides/remix';
import { SimpleResponse } from '~/overrides/remixjs/client';
import { handleCatchClauseAsSimpleResponse } from '~/utils/functions/handleErrors/handleCatchClauseSimple';

export type ActionResponse = SimpleResponse<undefined, undefined>;
export const action = async ({ params }: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> => {
  try {
    if (params['id']) {
      return json({
        hasError: false,
        message: 'Removed',
        info: undefined,
      });
    }
    return redirect('/branding');
  } catch (error) {
    return handleCatchClauseAsSimpleResponse(error);
  }
};
