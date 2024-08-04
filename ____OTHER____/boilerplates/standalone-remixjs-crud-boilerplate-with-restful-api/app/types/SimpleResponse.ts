import { StatusCodeMappingToString } from '~/services/constants/StringMappingToStatusCode';
import { SimpleResponse as BaseSimpleResponse } from '~/shared/remixjs/client';
import { AnyRecord } from '~/shared/typescript-utilities';

export type SimpleResponse<Model, FieldsError extends AnyRecord | undefined> = BaseSimpleResponse<
  Model,
  FieldsError,
  { errorCode?: keyof typeof StatusCodeMappingToString }
>;
