import { useEffect, useState } from "react";
import flagsmith from "flagsmith";
import { FLAGS } from "@/types";

export const useFlag = (flagKey: FLAGS): boolean => {
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (flagsmith.initialised) {
      setEnabled(flagsmith.hasFeature(FLAGS[flagKey]));
    } else {
      setEnabled(true);
    }
  }, [flagKey]);

  return enabled;
};
