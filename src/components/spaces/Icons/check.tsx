import { v3Tokens } from "@/config/tokens";

export default function Check(props: any) {
  const { type, allowCreateBasic } = props;

  const color = () => {
    if (type == "PREMIUM") {
      return "url(#paint0_linear_11642_19953)";
    } else if (type == "BASIC" && allowCreateBasic) {
      return v3Tokens.surface.on;
    } else if (type == "BASIC" && !allowCreateBasic) {
      return "#3D4D5C80";
    }
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.36713 10.1L12.0171 4.45C12.1505 4.31667 12.306 4.25 12.4838 4.25C12.6616 4.25 12.8171 4.31667 12.9505 4.45C13.0838 4.58333 13.1505 4.74167 13.1505 4.925C13.1505 5.10833 13.0838 5.26667 12.9505 5.4L6.8338 11.5333C6.70046 11.6667 6.54491 11.7333 6.36713 11.7333C6.18935 11.7333 6.0338 11.6667 5.90046 11.5333L3.0338 8.66667C2.90046 8.53333 2.83657 8.375 2.84213 8.19167C2.84769 8.00833 2.91713 7.85 3.05046 7.71667C3.1838 7.58333 3.34213 7.51667 3.52546 7.51667C3.7088 7.51667 3.86713 7.58333 4.00046 7.71667L6.36713 10.1Z"
        fill={color()}
      />
      {type == "PREMIUM" && (
        <defs>
          <linearGradient
            id="paint0_linear_11642_19960"
            x1="2.8418"
            y1="11.7333"
            x2="13.8967"
            y2="10.3898"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1B4D7E" />
            <stop offset="0.33" stopColor="#2D80D2" />
            <stop offset="1" stopColor="#1B4D7E" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
