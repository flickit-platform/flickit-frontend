import { TStatus } from "@/types/index";
const hasStatus = (status: TStatus) => {
  if (!status || (status && status === "Not Calculated")) {
    return false;
  }
  return true;
};

export default hasStatus;
