// hooks/useFlagsmith.ts
import { useEffect, useState } from "react";
import flagsmith from "flagsmith";

export const useFlagsmith = () => {
  console.log(
    "Loaded Environment Key:",
    import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY,
  );
  console.log("Loaded API Key:", import.meta.env.VITE_FLAGSMITH_API);
  const [ready, setReady] = useState(false);
  const [features, setFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    flagsmith.init({
      environmentID: import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY,
      api: import.meta.env.VITE_FLAGSMITH_API,
      onChange: () => {
        const allFlags = flagsmith.getAllFlags();
        const mapped = Object.fromEntries(
          Object.entries(allFlags).map(([key, flag]) => [key, flag.enabled]),
        );
        setFeatures(mapped);
        setReady(true);
      },
    });
    flagsmith.identify(sessionStorage.getItem("currentUser") ?? "");
  }, []);

  const isEnabled = (feature: string) => features[feature] ?? false;

  return { ready, isEnabled, features };
};
