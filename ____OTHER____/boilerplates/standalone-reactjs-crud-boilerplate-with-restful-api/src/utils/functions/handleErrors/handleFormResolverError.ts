import { keys } from 'ramda';
import type { RTHandleError } from './@types/RemixJsonFunction';
import type { FieldErrors, FieldValues } from 'react-hook-form';
import { SimpleResponse } from '~/overrides/remixjs/client';
import { AnyRecord } from '~/shared/typescript-utilities';

export const handleFormResolverError = <
  FormValues extends FieldValues = any,
  Model = any,
  FieldsError extends AnyRecord | undefined = undefined,
>(
  errors: FieldErrors<FormValues>,
): RTHandleError<SimpleResponse<Model, FieldsError>> => {
  console.log('handleFormResolverError', errors);
  return [
    {
      message: `[FormResolver]: ${errors}`,
      hasError: true,
      info: undefined,
      fieldsError: keys(errors).reduce<SimpleResponse<any, any>['fieldsError']>((result, fieldError) => {
        return {
          ...result,
          [fieldError]: errors[fieldError]?.message,
        };
      }, {}),
    },
    { status: 400 },
  ];
};
