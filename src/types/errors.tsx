export enum ECustomErrorType {
  DEFAULT = "DEFAULT",
  UNAUTHORIZED = "UNAUTHORIZED",
  NETWORK_CONNECTION = "NETWORK_CONNECTION",
  INVALID_TOKEN = "INVALID_TOKEN",
  NOT_FOUND = "NOT_FOUND",
  CANCELED = "ERR_CANCELED",
  ACCESS_DENIED = "ACCESS_DENIED",
  ERR_BAD_REQUEST = "ERR_BAD_REQUEST",
}

export interface ICustomError {
  code: string;
  message: string;
  status: number;
}

export enum ErrorCodes {
  CalculateNotValid = "CALCULATE_NOT_VALID",
  ConfidenceCalculationNotValid = "CONFIDENCE_CALCULATION_NOT_VALID",
  NotFound = "NOT_FOUND",
}
