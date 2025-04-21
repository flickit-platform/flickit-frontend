import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";
import flagsmith from "flagsmith";
import { flagsReducer } from "./reducer";
import { SET_SHOW_BUTTON } from "./actions";
import { useAuthContext } from "../AuthProvider";

interface FlagsContextType {
  showButton: boolean;
  dispatch: React.Dispatch<any>;
}

const FlagsContext = createContext<FlagsContextType | undefined>(undefined);

export const useFlags = (): FlagsContextType => {
  const context = useContext(FlagsContext);
  if (!context) {
    throw new Error("useFlags must be used within a FlagsProvider");
  }
  return context;
};

export const FlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useAuthContext();
  const [state, dispatch] = useReducer(flagsReducer, {
    showButton: false,
  });

  useEffect(() => {
    const userEmail = userInfo.email;
    flagsmith.identify(userEmail);
    const isExpertGroup = flagsmith.hasFeature("display_expert_groups");
    dispatch({
      type: SET_SHOW_BUTTON,
      payload: isExpertGroup,
    });
  }, [userInfo.email]);

  return (
    <FlagsContext.Provider value={{ showButton: state.showButton, dispatch }}>
      {children}
    </FlagsContext.Provider>
  );
};
