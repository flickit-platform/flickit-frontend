import Box from "@mui/material/Box";
import { styles } from "@styles";
import { ECustomErrorType, ErrorCodes } from "@/types/index";
import { ICustomError } from "@/utils/custom-error";
import ErrorEmptyData from "./errors/ErrorEmptyData";
import ErrorDataLoading from "./errors/ErrorDataLoading";
import ErrorRecalculating from "./errors/ErrorRecalculating";
import { ErrorNotFoundOrAccessDenied } from "./errors/ErrorNotFoundOrAccessDenied";
import GettingThingsReadyLoading from "./loadings/GettingThingsReadyLoading";
import { AxiosRequestConfig } from "axios";
import { ReactNode } from "react";

interface IQueryData<T> {
  data: T;
  loading: boolean;
  error: boolean;
  loaded: boolean;
  errorObject?: ICustomError;
  query?: (args?: any, config?: AxiosRequestConfig<any>) => Promise<any>;
  abortController?: AbortController;
}

interface IQueryBatchDataProps<T> {
  loadingComponent?: ReactNode;
  emptyDataComponent?: ReactNode;
  errorComponent?: ReactNode;
  render: (data: T[]) => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (
    err: (ICustomError | ICustomError[] | undefined)[] | undefined,
    errorComponent: ReactNode,
  ) => ReactNode;
  isDataEmpty?: (data?: T[]) => boolean;
  queryBatchData: IQueryData<any>[];
  data?: T[];
  loading?: boolean;
  error?: boolean;
  loaded?: boolean;
  errorObject?: ICustomError[];
}

const QueryBatchData = <T = any,>(props: IQueryBatchDataProps<T>) => {
  const {
    render,
    queryBatchData = [],
    isDataEmpty,
    errorComponent = <ErrorDataLoading />,
    renderLoading = () => loadingComponent,
    loadingComponent = (
      <Box sx={{ ...styles.centerVH }} pt={3}>
        <GettingThingsReadyLoading />
      </Box>
    ),
    renderError = defaultRenderError,
    emptyDataComponent = <ErrorEmptyData />,
    data = reduceData<T>(queryBatchData),
    loading = reduceLoadings<T>(queryBatchData),
    loaded = reduceLoaded<T>(queryBatchData),
    error = reduceError<T>(queryBatchData),
    errorObject = reduceErrorObject<T>(queryBatchData),
  } = props;

  if (loading) {
    return renderLoading();
  }
  const accessDenied = errorObject.find((errorObj?: ICustomError) => {
    return (
      errorObj?.response?.data.code === ECustomErrorType.ACCESS_DENIED ||
      errorObj?.response?.data.code === ECustomErrorType.NOT_FOUND
    );
  });
  if (accessDenied) {
    return <ErrorNotFoundOrAccessDenied />;
  }
  if (error) {
    return renderError(errorObject, errorComponent);
  }
  const isEmpty = loaded && isDataEmpty ? isDataEmpty(data) : false;
  if (isEmpty) {
    return emptyDataComponent;
  }
  return (
    <>
      {loaded && data?.length === queryBatchData?.length ? render(data) : null}
    </>
  );
};

export const defaultRenderError = (
  err: ICustomError | any[] | undefined,
  errorComponent: ReactNode = <ErrorDataLoading />,
): any => {
  if (!err) {
    return errorComponent;
  }
  if (Array.isArray(err)) {
    for (const item of err) {
      if (item?.response?.data?.code == ErrorCodes.CalculateNotValid) {
        return <ErrorRecalculating />;
      }
      if (
        item?.response?.data?.code == ErrorCodes.ConfidenceCalculationNotValid
      ) {
        return <ErrorRecalculating />;
      }
    }
  }
  if (Array.isArray(err)) {
    if (err.length === 0) {
      return errorComponent;
    }
    if (err[err.length - 1]) {
      return defaultRenderError(err[err.length - 1]);
    } else {
      const errTemp = err;
      const error = errTemp.find((er: any) => er?.type);
      if (error) {
        return defaultRenderError(error);
      }
      return errorComponent;
    }
  }

  if (
    err.code === ECustomErrorType.NOT_FOUND ||
    err.code === ECustomErrorType.ACCESS_DENIED
  ) {
    return <ErrorNotFoundOrAccessDenied />;
  }
  if (err?.response?.data?.code == ErrorCodes.CalculateNotValid) {
    return <ErrorRecalculating />;
  }
  if (err?.response?.data?.code == ErrorCodes.ConfidenceCalculationNotValid) {
    return <ErrorRecalculating />;
  }

  return errorComponent;
};

const reduceData = <T = any,>(queryBatchData: IQueryData<T>[]) => {
  return queryBatchData.map((query) => query.data);
};

const reduceLoadings = <T = any,>(queryBatchData: IQueryData<T>[]) => {
  return queryBatchData.reduce(
    (prevQuery, currentQuery) => ({
      ...currentQuery,
      loading: !!(prevQuery.loading || currentQuery.loading),
    }),
    { loading: false } as IQueryData<T>,
  ).loading;
};

const reduceLoaded = <T = any,>(queryBatchData: IQueryData<T>[]) => {
  return queryBatchData.reduce(
    (prevQuery, currentQuery) => {
      return {
        ...currentQuery,
        loaded: !!(prevQuery.loaded && currentQuery.loaded),
      };
    },
    { loaded: true } as IQueryData<T>,
  ).loaded;
};

const reduceError = <T = any,>(queryBatchData: IQueryData<T>[]) => {
  return queryBatchData.reduce(
    (prevQuery, currentQuery) => ({
      ...currentQuery,
      error: !!(prevQuery.error || currentQuery.error),
    }),
    { error: false } as IQueryData<T>,
  ).error;
};

const reduceErrorObject = <T = any,>(queryBatchData: IQueryData<any>[]) => {
  return queryBatchData.map((query) => query.errorObject);
};

export default QueryBatchData;
