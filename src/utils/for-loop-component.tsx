import { ReactElement } from "react";

const forLoopComponent = (
  numberOfIterations: number,
  cb: (index: number) => ReactElement,
) => {
  const components: ReactElement[] = [];
  for (let index = 0; index < numberOfIterations; index++) {
    components[index] = cb(index);
  }
  return components;
};

export default forLoopComponent;
