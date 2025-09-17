import { useLayoutEffect } from "react";
import setDocumentTitle from "../utils/setDocumentTitle";
import { useConfigContext } from "@/providers/config-provider";

const useDocumentTitle = (title: string = "") => {
  const { config } = useConfigContext();
  useLayoutEffect(() => {
    setDocumentTitle(title, config.appTitle);
  }, []);

  return setDocumentTitle;
};

export default useDocumentTitle;
