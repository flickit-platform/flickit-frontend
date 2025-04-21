import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useMemo,
  FC,
} from "react";
import {
  KitLanguageState,
  initialKitLanguageState,
  kitLanguageReducer,
} from "./reducer";

interface KitLanguageContextType {
  kitState: KitLanguageState;
  dispatch: Dispatch<any>; 
}

const KitLanguageContext = createContext<KitLanguageContextType | undefined>(
  undefined,
);

export const KitLanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [kitState, dispatch] = useReducer(
    kitLanguageReducer,
    initialKitLanguageState,
  );

  const value = useMemo(
    () => ({ kitState, dispatch }),
    [kitState, dispatch],
  );

  return (
    <KitLanguageContext.Provider value={value}>
      {children}
    </KitLanguageContext.Provider>
  );
};

export const useKitLanguageContext = (): KitLanguageContextType => {
  const context = useContext(KitLanguageContext);
  if (!context) {
    throw new Error(
      "useKitLanguageContext must be used within a KitLanguageProvider",
    );
  }
  return context;
};
