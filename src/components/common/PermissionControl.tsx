import { PropsWithChildren } from "react";
import { ECustomErrorType } from "@types";
import { ICustomError } from "@utils/CustomError";
import { ErrorNotFoundOrAccessDenied } from "./errors/ErrorNotFoundOrAccessDenied";

const PermissionControl = (props: PropsWithChildren<any>) => {
  // console.log(props);
  const { children, error, loading } = props;

  if (loading) {
    return <>{children}</>;
  }

  const hasViewPermission = getHasViewPermission(error);

  if (!hasViewPermission) {
    return <ErrorNotFoundOrAccessDenied />;
  }

  return <>{children}</>;
};

const getHasViewPermission = (
  error: (ICustomError | undefined) | (ICustomError | undefined)[],
) => {
  if (
    !error ||
    (typeof error === "object" && Object.keys(error).length === 0)
  ) {
    return true;
  }
  if (Array.isArray(error)) {
    if (error.length === 0) {
      return true;
    }
    if (
      error.findIndex(
        (err) =>
          err?.code === ECustomErrorType.ACCESS_DENIED ||
          err?.code === ECustomErrorType.NOT_FOUND || err?.status === 404 || err?.status === 403,
      ) !== -1
    ) {
      return false;
    }
    return true;
  }
  if (
    error.code === ECustomErrorType.ACCESS_DENIED ||
    error.code === ECustomErrorType.NOT_FOUND
  ) {
    return false;
  }
  return true;
};

export default PermissionControl;
