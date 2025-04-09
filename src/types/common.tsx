import { AxiosRequestConfig } from "axios";

type ModelValue = {
  id: number;
  title: string;
};

export type TId = string | number;

export interface IDefaultModel<T = any> {
  count: number;
  next: null;
  previous: null;
  results: T[];
  items: T[];
}

export interface IImage {
  id: TId;
  image: string;
}

export type TImages = IImage[];

export type TStatus =
  | "WEAK"
  | "RISKY"
  | "NORMAL"
  | "GOOD"
  | "OPTIMIZED"
  | "ELEMENTARY"
  | "MODERATE"
  | "GREAT"
  | "Not Calculated"
  | null;

export interface IColor {
  code: string;
  id: TId;
}

export interface IColorModel {
  color_code: string;
  id: TId;
  title: string;
}

export interface ITotalProgress {
  progress: number;
  total_answered_question_number: number;
  total_question_number: number;
  answersCount?: number;
  questionsCount?: number;
}

export interface IMapper {
  code: string;
  title: string;
}

export interface PathInfo {
  space?: ModelValue;
  assessment?: ModelValue;
}

export type TQueryProps<T = any, A = any> = {
  data: T;
  loading: boolean;
  loaded: boolean;
  error: boolean;
  errorObject?: any;
  query: (args?: A, config?: AxiosRequestConfig<any>) => Promise<T>;
  abortController?: AbortController;
};

export type TQueryFunction<T = any, A = any> = (
  args?: A,
  config?: AxiosRequestConfig<any>,
) => Promise<T>;
