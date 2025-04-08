import { IDynamicGaugeSVGProps } from "@/types/index";
import "./style.css";

const GaugeComponent2 = (props: IDynamicGaugeSVGProps) => {
  const { colorCode, value, height, className } = props;
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.0273 128.584C8.08787 129.864 3.82743 127.713 2.84621 123.688C-0.286942 110.839 -0.845659 97.4691 1.23117 84.3566C3.69986 68.7698 9.82244 53.9886 19.0983 41.2215C28.3742 28.4543 40.5399 18.0638 54.6009 10.8993C66.43 4.87217 79.3177 1.27215 92.5069 0.281108C96.6374 -0.0292586 100 3.35786 100 7.5C100 11.6421 96.6357 14.9656 92.5097 15.3307C81.6901 16.2878 71.13 19.3123 61.4108 24.2644C49.459 30.3542 39.118 39.1862 31.2336 50.0383C23.3491 60.8903 18.1449 73.4543 16.0465 86.7031C14.3401 97.4769 14.7269 108.455 17.16 119.041C18.0879 123.077 15.9667 127.304 12.0273 128.584Z"
        fill={`${value >= 1 ? colorCode : "black"}`}
        fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
      />
      <path
        d="M100 7.5C100 3.35786 103.363 -0.0292584 107.493 0.281108C120.682 1.27215 133.57 4.87217 145.399 10.8993C159.46 18.0638 171.626 28.4543 180.902 41.2215C190.178 53.9886 196.3 68.7698 198.769 84.3565C200.846 97.4691 200.287 110.839 197.154 123.688C196.173 127.713 191.912 129.864 187.973 128.584C184.033 127.304 181.912 123.077 182.84 119.041C185.273 108.455 185.66 97.4769 183.954 86.7031C181.855 73.4543 176.651 60.8903 168.766 50.0382C160.882 39.1862 150.541 30.3542 138.589 24.2644C128.87 19.3123 118.31 16.2878 107.49 15.3307C103.364 14.9656 100 11.6421 100 7.5Z"
        fill={`${value === 2 ? colorCode : "black"}`}
        fillOpacity={`${value === 2 ? "0.9" : "0.1"}`}
      />
    </svg>
  );
};

export default GaugeComponent2;
