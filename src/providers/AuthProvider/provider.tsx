import { useReducer, FC, useContext, createContext } from "react";
import authReducer from "./reducer";
import { IAuthContext } from "@/types";

interface IAuthProviderProps {
  children?: JSX.Element | JSX.Element[];
}


export const defaultUserInfo = {
  displayName: "",
  id: "",
  email: "",
  subscriberHash: "",
};

const getAccessTokenFormStorage = () => {
  try {
    const token = localStorage.getItem("accessToken");
    return token ? JSON.parse(token) : "";
  } catch (e) {
    return "";
  }
};

export const AuthContext = createContext<IAuthContext>({
  isAuthenticatedUser: false,
  accessToken: getAccessTokenFormStorage(),
  loadingUserInfo: true,
  userInfo: defaultUserInfo,
  currentSpace: {},
  redirectRoute: "",
  dispatch: () => {},
});

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticatedUser: false,
    accessToken: getAccessTokenFormStorage(),
    loadingUserInfo: true,
    userInfo: defaultUserInfo,
    currentSpace: {},
    redirectRoute: "",
    dispatch: () => {},
  });

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
