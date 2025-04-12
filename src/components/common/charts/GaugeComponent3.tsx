import { IDynamicGaugeSVGProps } from "@/types/index";
import "./style.css";

const GaugeComponent3 = (props: IDynamicGaugeSVGProps) => {
  const { colorCode, value, height, className } = props;
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 200 201"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.0273 128.584C8.08787 129.864 3.82735 127.713 2.84611 123.688C-1.53948 105.702 -0.85673 86.7983 4.89434 69.0983C10.6454 51.3983 21.2046 35.7033 35.3245 23.7301C38.4837 21.0512 43.1952 21.8149 45.6298 25.1659C48.0645 28.517 47.296 33.1834 44.1725 35.9039C32.5983 45.9849 23.9321 59.0473 19.1602 73.7336C14.3883 88.4199 13.7216 104.081 17.1599 119.04C18.0878 123.077 15.9667 127.304 12.0273 128.584Z"
        fill={`${value >= 1 ? colorCode : "black"}`}
        fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
      />
      <path
        d="M45.5707 25.209C43.1333 21.8598 43.8592 17.1424 47.3816 14.9629C63.1242 5.22152 81.31 0.0147714 99.9208 3.13644e-05C118.532 -0.0147087 136.726 5.16323 152.484 14.8796C156.009 17.0536 156.743 21.7699 154.311 25.1229C151.879 28.4758 147.204 29.1906 143.65 27.0635C130.479 19.1814 115.375 14.9878 99.9327 15C84.4906 15.0123 69.3929 19.2298 56.235 27.1328C52.6841 29.2655 48.008 28.5581 45.5707 25.209Z"
        fill={`${value >= 2 ? colorCode : "black"}`}
        fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
      />
      <path
        d="M153.769 25.7326C156.176 22.3621 160.882 21.5607 164.062 24.2142C178.278 36.0738 188.962 51.6837 194.855 69.3371C200.748 86.9905 201.582 105.889 197.341 123.909C196.392 127.941 192.148 130.127 188.199 128.878C184.249 127.63 182.094 123.42 182.99 119.376C186.308 104.39 185.516 88.7341 180.627 74.0865C175.737 59.4389 166.967 46.4464 155.312 36.4585C152.167 33.7632 151.361 29.103 153.769 25.7326Z"
        fill={`${value === 3 ? colorCode : "black"}`}
        fillOpacity={`${value === 3 ? "0.9" : "0.1"}`}
      />
    </svg>
  );
};

export default GaugeComponent3;
