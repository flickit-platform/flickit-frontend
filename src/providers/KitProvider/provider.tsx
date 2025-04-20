import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
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

export const KitLanguageProvider = ({ children }: { children: ReactNode }) => {
  const [kitState, dispatch] = useReducer(
    kitLanguageReducer,
    initialKitLanguageState,
  );

  return (
    <KitLanguageContext.Provider value={{ kitState, dispatch }}>
      {children}
    </KitLanguageContext.Provider>
  );
};

export const useKitLanguageContext = () => {
  const context = useContext(KitLanguageContext);
  if (!context) {
    throw new Error(
      "useKitLanguageContext must be used within a KitLanguageProvider",
    );
  }
  return context;
};
