import { PropsWithChildren } from "react";
import { ECustomErrorType } from "@/types/index";
import { ICustomError } from "@utils/CustomError";
import { ErrorNotFoundOrAccessDenied } from "./errors/ErrorNotFoundOrAccessDenied";
import { useConfigContext } from "@/providers/ConfgProvider";
import keycloakService from "@/service/keycloakService";

const PermissionControl = (props: PropsWithChildren<any>) => {
  const { children, error, loading } = props;
  const {
    config: { isAuthenticated },
  }: any = useConfigContext();

  if (loading) {
    return <>{children}</>;
  }

  const hasViewPermission = getHasViewPermission(error);

  if (!isAuthenticated && !hasViewPermission) {
    keycloakService.doLogin();
    return
  }

  if (!hasViewPermission) {
    return <ErrorNotFoundOrAccessDenied />;
  }

  return <>{children}</>;
};

const getHasViewPermission = (error?: ICustomError | ICustomError[]) => {
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
          err?.code === ECustomErrorType.NOT_FOUND ||
          err?.status === 404 ||
          err?.status === 403 ||
          err?.response?.data.code === ECustomErrorType.ACCESS_DENIED ||
          err?.response?.data.code === ECustomErrorType.NOT_FOUND ||
          err?.response?.status === 404 ||
          err?.response?.status === 403,
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
