import toastError from "@utils/toastError";
import {ICustomError} from "@utils/CustomError";

export const FetchQModalData = async (props: any)=>{
  const {id, title, openDialog, dialogProps, setLoading, navigate, queryDataSpaces, queryDataLang, service} = props
  const open =  openDialog ?? dialogProps
  const kits = await queryDataLang.query();
  const { languages : kitLangs } = kits.find((kit: any) => kit.id == id);
  const spaces = await queryDataSpaces.query()
  if(spaces.length == 1 && kitLangs.length == 1){
    const abortController = new AbortController();
    try {
      const {id: spaceId} = spaces[0]
      const langCode = kitLangs[0].code
      await service.assessments.info
        .create(
          {
            data: {
              spaceId,
              assessmentKitId: id,
              lang: langCode,
              title: langCode == "EN" ? "Untitled" : "بدون عنوان",
            },
          },
          { signal: abortController.signal },
        )
        .then((res: any) => {
          if (window.location.hash) {
            history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search,
            );
          }
          setLoading(false)
          return navigate(
            `/${spaceId}/assessments/1/${res.data?.id}/questionnaires`,
          );
        });
    }catch (e){
      const err = e as ICustomError;
      setLoading(false)
      toastError(err);
      return () => {
        abortController.abort();
      };
    }
  }else {
    setLoading(false)
    open.openDialog({
      type: "create",
      staticData: { assessment_kit: { id, title }, langList: kitLangs, spaceList : spaces,  },
    });
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }
}