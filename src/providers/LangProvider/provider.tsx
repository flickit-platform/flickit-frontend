import React, {
  useReducer,
  FC,
  useContext,
  Dispatch,
  createContext,
  useEffect,
} from "react";
import { langReducer, initialLangState, LangState } from "./reducer";
import { LANG_ACTION_TYPES } from "./actions";

interface ILangProviderProps {
  children?: React.ReactNode;
}

interface ILangContext extends LangState {}

const LangContext = createContext<ILangContext>(initialLangState);

const LangDispatchContext = createContext<Dispatch<LANG_ACTION_TYPES>>(() => {});

export const LangProvider: FC<ILangProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(langReducer, initialLangState);

  useEffect(() => {
    localStorage.setItem("lang", state.lang);
    document.cookie = `NEXT_LOCALE=${state.lang}; max-age=31536000; path=/`;
  }, [state.lang]);

  return (
    <LangContext.Provider value={state}>
      <LangDispatchContext.Provider value={dispatch}>
        {children}
      </LangDispatchContext.Provider>
    </LangContext.Provider>
  );
};

export const useLangContext = () => {
  const context = useContext(LangContext);
  if (context === undefined) {
    throw new Error("useLangContext must be used within a LangProvider");
  }
  return context;
};

export const useLangDispatch = () => {
  const context = useContext(LangDispatchContext);
  if (context === undefined) {
    throw new Error("useLangDispatch must be used within a LangProvider");
  }
  return context;
};
