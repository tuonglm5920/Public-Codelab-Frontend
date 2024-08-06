import { FieldValues, Resolver, FieldErrors, FieldErrorsImpl, DeepRequired } from 'react-hook-form';

/**
 * Generates an output object from the given form data, where the keys in the output object retain
 * the structure of the keys in the form data. Keys containing integer indexes are treated as arrays.
 *
 * @param {FormData} formData - The form data to generate an output object from.
 * @returns {Object} The output object generated from the form data.
 */
export const generateFormData = (formData: FormData): Record<any, any> => {
  // Initialize an empty output object.
  const outputObject: Record<any, any> = {};

  // Iterate through each key-value pair in the form data.
  for (const [key, value] of formData.entries()) {
    // Split the key into an array of parts.
    const keyParts = key.split('.');
    // Initialize a variable to point to the current object in the output object.
    let currentObject = outputObject;

    // Iterate through each key part except for the last one.
    for (let i = 0; i < keyParts.length - 1; i++) {
      // Get the current key part.
      const keyPart = keyParts[i];
      // If the current object doesn't have a property with the current key part,
      // initialize it as an object or array depending on whether the next key part is a valid integer index or not.
      if (!currentObject[keyPart]) {
        currentObject[keyPart] = /^\d+$/.test(keyParts[i + 1]) ? [] : {};
      }
      // Move the current object pointer to the next level of the output object.
      currentObject = currentObject[keyPart];
    }

    // Get the last key part.
    const lastKeyPart = keyParts[keyParts.length - 1];
    const lastKeyPartIsArray = /\[\d*\]$|\[\]$/.test(lastKeyPart);

    // Handles array[] or array[0] cases
    if (lastKeyPartIsArray) {
      const key = lastKeyPart.replace(/\[\d*\]$|\[\]$/, '');
      if (!currentObject[key]) {
        currentObject[key] = [];
      }
      currentObject[key].push(value);
    }

    // Handles array.foo.0 cases
    if (!lastKeyPartIsArray) {
      // If the last key part is a valid integer index, push the value to the current array.
      if (/^\d+$/.test(lastKeyPart)) {
        (currentObject as any[]).push(value);
      }
      // Otherwise, set a property on the current object with the last key part and the corresponding value.
      else {
        currentObject[lastKeyPart] = value;
      }
    }
  }

  // Return the output object.
  return outputObject;
};

export const getFormDataFromSearchParams = (request: Pick<Request, 'url'>): Record<any, any> => {
  const searchParams = new URL(request.url).searchParams;
  return generateFormData(searchParams as any);
};

export const isGet = (request: Pick<Request, 'method'>): boolean => {
  return request.method === 'GET' || request.method === 'get';
};

/**
Parses the specified Request object's FormData to retrieve the data associated with the specified key.
@template T - The type of the data to be returned.
@param {Request} request - The Request object whose FormData is to be parsed.
@param {string} [key="formData"] - The key of the data to be retrieved from the FormData.
@returns {Promise<T>} - A promise that resolves to the data of type T.
@throws {Error} - If no data is found for the specified key, or if the retrieved data is not a string.
*/
export const parseFormData = async <T>(request: Request, key = 'formData'): Promise<T> => {
  const formData = await request.formData();
  const data = formData.get(key);

  if (!data) {
    return generateFormData(formData);
  }

  if (!(typeof data === 'string')) {
    throw new Error('Data is not a string');
  }

  return JSON.parse(data);
};

/**
 * Helper method used in actions to validate the form data parsed from the frontend using zod and return a json error if validation fails.
 * @param data Data to validate
 * @param resolver Schema to validate and cast the data with
 * @returns Returns the validated data if successful, otherwise returns the error object
 */
export const validateFormData = async <T extends FieldValues>(
  data: any,
  resolver: Resolver,
): Promise<{ errors: FieldErrors<FieldValues> | {}; data: T | undefined }> => {
  const { errors, values } = await resolver(data, {}, { shouldUseNativeValidation: false, fields: {} });

  if (Object.keys(errors).length > 0) {
    return { errors: errors as FieldErrors<T>, data: undefined };
  }

  return { errors: {}, data: values as T };
};

/**
 * Parses the data from an HTTP request and validates it against a schema. Works in both loaders and actions, in loaders it extracts the data from the search params.
 * In actions it extracts it from request formData.
 *
 * @async
 * @param {Request} request - An object that represents an HTTP request.
 * @param validator - A function that resolves the schema.
 * @returns A Promise that resolves to an object containing the validated data or any errors that occurred during validation.
 */
export const getValidatedFormData = async <T extends FieldValues>(
  request: Request,
  resolver: Resolver,
): Promise<{ errors: FieldErrors<FieldValues> | {}; data: T | undefined; receivedValues: T }> => {
  const data = isGet(request) ? getFormDataFromSearchParams(request) : await parseFormData<T>(request);
  const validatedOutput = await validateFormData<T>(data, resolver);
  return { ...validatedOutput, receivedValues: data };
};

/**
  Creates a new instance of FormData with the specified data and key.
  @template T - The type of the data parameter. It can be any type of FieldValues.
  @param {T} data - The data to be added to the FormData. It can be either an object of type FieldValues.
  @param {string} [key="formData"] - The key to be used for adding the data to the FormData.
  @returns {FormData} - The FormData object with the data added to it.
*/
export const createFormData = <T extends FieldValues>(data: T, key = 'formData'): FormData => {
  const formData = new FormData();
  const finalData = JSON.stringify(data);
  formData.append(key, finalData);
  return formData;
};
/**

Merges two error objects generated by a resolver, where T is the generic type of the object.
The function recursively merges the objects and returns the resulting object.
@template T - The generic type of the object.
@param frontendErrors - The frontend errors
@param backendErrors - The backend errors
@returns The merged errors of type Partial<FieldErrorsImpl<DeepRequired<T>>>.
*/
export const mergeErrors = <T extends FieldValues>(
  frontendErrors: Partial<FieldErrorsImpl<DeepRequired<T>>>,
  backendErrors?: Partial<FieldErrorsImpl<DeepRequired<T>>>,
  validKeys: string[] = [],
  depth = 0,
): Partial<FieldErrorsImpl<DeepRequired<T>>> => {
  if (!backendErrors) {
    return frontendErrors;
  }

  for (const [key, rightValue] of Object.entries(backendErrors) as [keyof T, DeepRequired<T>[keyof T]][]) {
    if (!validKeys.includes(key.toString()) && validKeys.length && depth === 0) {
      continue;
    }
    if (typeof rightValue === 'object' && !Array.isArray(rightValue)) {
      if (!frontendErrors[key]) {
        frontendErrors[key] = {} as DeepRequired<T>[keyof T];
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mergeErrors(frontendErrors[key]!, rightValue, validKeys, depth + 1);
    } else if (rightValue) {
      frontendErrors[key] = rightValue;
    }
  }

  return frontendErrors;
};
