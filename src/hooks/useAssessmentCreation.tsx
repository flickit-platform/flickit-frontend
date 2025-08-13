import { useCallback } from "react";
import { ICustomError } from "@utils/CustomError";
import { useConnectAutocompleteField } from "@/components/common/fields/AutocompleteAsyncField";
import { useNavigate } from "react-router-dom";
import { useServiceContext } from "@/providers/ServiceProvider";
import showToast from "@utils/toastError";

export function useAssessmentCreation({
  openDialog,
}: {
  openDialog: (params: any) => void;
}) {
  const navigate = useNavigate();
  const { service } = useServiceContext();

  const queryDataSpaces = useConnectAutocompleteField({
    service: (args, config) => service.space.topSpaces(args, config),
  });

  const createOrOpenDialog = useCallback(
    async ({
      id,
      title,
      languages,
      setLoading,
    }: {
      id: string;
      title: string;
      languages: Array<{ code: string }>;
      setLoading: (flag: boolean) => void;
    }) => {
      setLoading(true);
      let spaces;
      try {
        spaces = await queryDataSpaces.query();
      } catch (err) {
        setLoading(false);
        openDialog({
          type: "limitExceeded",
          staticData: {
            assessment_kit: { id, title },
            langList: languages,
            spaceList: spaces,
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

          if (window.location.hash) {
            history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search,
            );
          }
          setLoading(false);
          navigate(`/${spaceId}/assessments/1/${data?.id}/questionnaires`);
        } catch (e) {
          setLoading(false);
          showToast(e as ICustomError);
          return () => abortController.abort();
        }
      } else {
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
        if (window.location.hash) {
          history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }
      }
    },
    [navigate, openDialog, service],
  );

  return {
    createOrOpenDialog,
  };
}
