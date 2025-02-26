export default function PreAttachment({ mainColor }: any) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.25"
        y="0.25"
        width="39.5"
        height="39.5"
        rx="19.75"
        fill={"inherit"}
      />
      <rect
        x="0.25"
        y="0.25"
        width="39.5"
        height="39.5"
        rx="19.75"
        stroke={mainColor}
        strokeWidth="0.5"
      />
      <path
        d="M24 19V14H26V19H24ZM19 25.9C18.4167 25.7333 17.9375 25.4083 17.5625 24.925C17.1875 24.4417 17 23.8833 17 23.25V14H19V25.9ZM19.75 30C18.0167 30 16.5417 29.3917 15.325 28.175C14.1083 26.9583 13.5 25.4833 13.5 23.75V14.5C13.5 13.25 13.9375 12.1875 14.8125 11.3125C15.6875 10.4375 16.75 10 18 10C19.25 10 20.3125 10.4375 21.1875 11.3125C22.0625 12.1875 22.5 13.25 22.5 14.5V22H20.5V14.5C20.4833 13.8 20.2375 13.2083 19.7625 12.725C19.2875 12.2417 18.7 12 18 12C17.3 12 16.7083 12.2417 16.225 12.725C15.7417 13.2083 15.5 13.8 15.5 14.5V23.75C15.4833 24.9333 15.8917 25.9375 16.725 26.7625C17.5583 27.5875 18.5667 28 19.75 28C20.1667 28 20.5625 27.9458 20.9375 27.8375C21.3125 27.7292 21.6667 27.5667 22 27.35V29.575C21.65 29.7083 21.2875 29.8125 20.9125 29.8875C20.5375 29.9625 20.15 30 19.75 30ZM24 29V26H21V24H24V21H26V24H29V26H26V29H24Z"
        fill={mainColor}
      />
    </svg>
  );
}
