import { AnyRecord } from '~/shared/typescript-utilities';

export type SimpleResponse<
  T,
  FieldsError extends AnyRecord | undefined = undefined,
  Extra extends AnyRecord = AnyRecord,
> = Extra & {
  message: string;
  hasError: boolean;
  info: T | undefined;
  fieldsError?: Partial<FieldsError>;
};
