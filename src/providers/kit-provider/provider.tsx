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
  KitLDesignerState,
  initialKitLDesignerState,
  kitLanguageReducer,
} from "./reducer";

interface KitLDesignerContextType {
  kitState: KitLDesignerState;
  dispatch: Dispatch<any>; 
}

const KitLanguageContext = createContext<KitLDesignerContextType | undefined>(
  undefined,
);

export const KitLanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [kitState, dispatch] = useReducer(
    kitLanguageReducer,
    initialKitLDesignerState,
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

export const useKitDesignerContext = (): KitLDesignerContextType => {
  const context = useContext(KitLanguageContext);
  if (!context) {
    throw new Error(
      "useKitDesignerContext must be used within a KitLanguageProvider",
    );
  }
  return context;
};
