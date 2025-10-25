import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { ICustomError } from "../utils/custom-error";
import dataExist from "../utils/data-exist";
import showToast, { IToastOptions } from "../utils/toast-error";
import get from "lodash/get";

export type TQueryServiceFunction<T = any, A = any> = (
  args?: A,
  config?: AxiosRequestConfig<any>,
) => Promise<AxiosResponse<T, any>>;

interface IUseQueryProps<T, A> {
  initialData?: any;
  runOnMount?: boolean;
  initialLoading?: boolean;
  toastError?: boolean | ((err: ICustomError, options?: IToastOptions) => void);
  toastErrorOptions?: IToastOptions;
  service: TQueryServiceFunction<T, A>;
  accessor?: string;
}

// --- helpers
const isCanceled = (e: any) =>
  axios.isCancel?.(e) ||
  e?.code === "ERR_CANCELED" ||
  e?.name === "CanceledError" ||
  e?.message === "canceled";

export const useQuery = <T = any, A = any>(props: IUseQueryProps<T, A>) => {
  const {
    initialData,
    service,
    runOnMount = true,
    initialLoading = runOnMount,
    toastError = false,
    toastErrorOptions,
    accessor,
  } = props;

  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(false);
  const [errorObject, setErrorObject] = useState<undefined | ICustomError>();
  const controllerRef = useRef<AbortController>(new AbortController);
  const isMounted = useRef(true);

  useEffect(() => {
    if (runOnMount) {
      query();
    }
    return () => {
      isMounted.current = false;
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const safeSet = <S>(setter: (v: S) => void, v: S) => {
    if (isMounted.current) setter(v);
  };

  const query = async (
    args?: A,
    config: AxiosRequestConfig<any> = {},
  ): Promise<any> => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    safeSet(setLoading, true);
    safeSet(setErrorObject, undefined);

    try {
      const { data: res } = await service(args, {
        signal: controller.signal,
        ...config,
      });

      const value = accessor ? get(res, accessor, initialData) : res;

      if (dataExist(value)) {
        safeSet(setData, value);
        safeSet(setError, false);
      } else {
        safeSet(setData, initialData);
        safeSet(setError, true);
      }

      safeSet(setLoading, false);
      return value;
    } catch (e: any) {
      if (isCanceled(e) || controller.signal.aborted) {
        safeSet(setLoading, false);
        return undefined;
      }

      const err = e as ICustomError;

      if (
        typeof toastError === "function" ||
        (typeof toastError === "boolean" && toastError)
      ) {
        showToast(err, toastErrorOptions);
      }

      safeSet(setErrorObject, err);
      safeSet(setLoading, false);
      safeSet(setError, true);

      return Promise.reject(err);
    }
  };

  const loaded = !loading && !error && dataExist(data);

  return {
    data,
    loading,
    loaded,
    error,
    errorObject,
    query,
    abortController: controllerRef.current,
  };
};
