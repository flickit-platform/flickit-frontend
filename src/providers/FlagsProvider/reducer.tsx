import { FlagsAction, SET_SHOW_BUTTON } from "./actions";

interface FlagsState {
  showButton: boolean;
}

// وضعیت اولیه
const initialState: FlagsState = {
  showButton: false,
};

// Reducer برای مدیریت وضعیت
export const flagsReducer = (state: FlagsState = initialState, action: FlagsAction): FlagsState => {
  switch (action.type) {
    case SET_SHOW_BUTTON:
      return {
        ...state,
        showButton: action.payload,
      };
    default:
      return state;
  }
};
