import { useCallback, useMemo } from "react";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { ICustomError } from "@utils/CustomError";
import { useConnectAutocompleteField } from "@/components/common/fields/AutocompleteAsyncField";
import { useNavigate } from "react-router-dom";
import { useServiceContext } from "@/providers/ServiceProvider";
import showToast from "@utils/toastError";

type Space = { id: string; [k: string]: any };

type TQueryServiceFunction<T = any> = (
  args?: any,
  config?: any,
) => Promise<AxiosResponse<T>>;

type ArrayFetcher = (
  args: any,
  config: AxiosRequestConfig<any> | undefined,
) => Promise<AxiosResponse<any, any>>;

interface UseAssessmentCreationParams {
  openDialog: (params: any) => void;
  getSpacesService?: TQueryServiceFunction<Space[]>;
  getSpacesArrayFetcher?: ArrayFetcher;
  getSpacesAccessor?: string;
}

export function useAssessmentCreation({
  openDialog,
  getSpacesService,
  getSpacesArrayFetcher,
  getSpacesAccessor,
}: UseAssessmentCreationParams) {
  const navigate = useNavigate();
  const { service } = useServiceContext();

  const wrapArrayFetcher = (
    fn: ArrayFetcher,
  ): TQueryServiceFunction<Space[]> => {
    return async (args, config) => {
      const res = await fn(args, config);
      return {
        ...res,
        data: res.data as Space[],
      } as AxiosResponse<Space[]>;
    };
  };

  const spacesService: TQueryServiceFunction<Space[]> = useMemo(() => {
    if (getSpacesService) return getSpacesService;
    if (getSpacesArrayFetcher) return wrapArrayFetcher(getSpacesArrayFetcher);
    return (args: any, config: any) => service.space.getTopSpaces(args, config);
  }, [getSpacesService, getSpacesArrayFetcher, service.space]);

  const queryDataSpaces = useConnectAutocompleteField({
    service: spacesService,
    accessor: getSpacesAccessor,
  });

  const clearHash = () => {
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  };

  const createOrOpenDialog = useCallback(
    async ({
      id,
      title,
      languages,
      setLoading,
      queryDataSpacesArgs,
    }: {
      id: string;
      title: string;
      languages: Array<{ code: string }>;
      setLoading: (flag: boolean) => void;
      queryDataSpacesArgs?: any;
    }) => {
      setLoading(true);
      let spaces: Space[] = [];
      try {
        spaces = await queryDataSpaces.query(queryDataSpacesArgs);
      } catch (err) {
        setLoading(false);
        openDialog({
          type: "limitExceeded",
          staticData: {
            assessment_kit: { id, title },
            langList: languages,
            spaceList: spaces ?? [],
            queryDataSpaces,
          },
        });
        return;
      }

      if (spaces.length === 1 && languages.length === 1) {
        const abortController = new AbortController();
        try {
          const { id: spaceId } = spaces[0];
          const langCode = languages[0].code;
          const { data } = await service.assessments.info.create(
            {
              data: {
                spaceId,
                assessmentKitId: id,
                lang: langCode,
                title: langCode === "EN" ? "Untitled" : "بدون عنوان",
              },
            },
            { signal: abortController.signal },
          );
          clearHash();
          setLoading(false);
          navigate(`/${spaceId}/assessments/1/${data?.id}/questionnaires`);
          return;
        } catch (e) {
          setLoading(false);
          showToast(e as ICustomError);
          return () => abortController.abort();
        }
      }

      setLoading(false);
      openDialog({
        type: "create",
        staticData: {
          assessment_kit: { id, title },
          langList: languages,
          spaceList: spaces,
          queryDataSpaces,
        },
      });
      clearHash();
    },
    [navigate, openDialog, service.assessments.info, queryDataSpaces],
  );

  return { createOrOpenDialog, queryDataSpaces };
}
