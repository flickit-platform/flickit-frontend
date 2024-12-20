import { ECustomErrorType } from "@types";
import CustomError from "./CustomError";

/**
 *
 * Creates custom error object out of service response
 *
 */
const createCustomErrorFromResponseError = (err: any) => {
  const { name, toJSON, response = {}, config = {} } = err;
  const { toastConfig } = config;

  const errorType = getCustomErrorType(err);
  const errorMessage = getCustomErrorMessage(err);
  const ErrorObject = CustomError({
    code: errorType,
    status: response.status,
    message: errorMessage,
    response: response,
    isAxiosError: true,
    toastConfig,
    name,
    toJSON,
  });

  return ErrorObject;
};

const getCustomErrorType = (err: any) => {
  const { response = {}, code: axiosCode } = err;
  const { statusText, data = {}, status } = response;
  const { code = axiosCode } = data;
  if (!statusText && !code && !status) {
    return ECustomErrorType.DEFAULT;
  }
  const errorType =
    errorToErrorTypeMap[statusText as string] ||
    errorToErrorTypeMap[code as string] ||
    errorToErrorTypeMap[status];

  return errorType;
};

const getCustomErrorMessage = (err: any) => {
  const { response = {}, message: axiosErrorMessage } = err;
  const { data = {} } = response;
  const { detail } = data;

  const errorMessage = detail || axiosErrorMessage;

  return errorMessage;
};

const errorToErrorTypeMap: Record<string, ECustomErrorType> = {
  Unauthorized: ECustomErrorType.UNAUTHORIZED,
  token_not_valid: ECustomErrorType.INVALID_TOKEN,
  "401": ECustomErrorType.UNAUTHORIZED,
  "404": ECustomErrorType.NOT_FOUND,
  "403": ECustomErrorType.ACCESS_DENIED,
  ERR_CANCELED: ECustomErrorType.CANCELED,
};

export default createCustomErrorFromResponseError;
