import { StatusCodeMappingToString } from '~/services/constants/StringMappingToStatusCode';
import { AnyRecord } from '~/shared/typescript-utilities';

type BaseSimpleResponse<
  T,
  FieldsError extends AnyRecord | undefined = undefined,
  Extra extends AnyRecord = AnyRecord,
> = Extra & {
  message: string;
  hasError: boolean;
  info: T | undefined;
  fieldsError?: Partial<FieldsError>;
};

export type SimpleResponse<Model, FieldsError extends AnyRecord | undefined> = BaseSimpleResponse<
  Model,
  FieldsError,
  { errorCode?: keyof typeof StatusCodeMappingToString }
>;
