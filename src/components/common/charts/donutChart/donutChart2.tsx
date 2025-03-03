import { IFlatGauge } from "@types";

const DonutChart2 = (props: IFlatGauge) => {
  const { colorCode, value, height } = props;
  return (
    <svg
      height={height ? height : "110"}
      viewBox= "0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M54.5929 79.3641C67.9239 79.3641 78.7308 68.5572 78.7308 55.2262C78.7308 41.8953 67.9239 31.0884 54.5929 31.0884C41.262 31.0884 30.4551 41.8953 30.4551 55.2262C30.4551 68.5572 41.262 79.3641 54.5929 79.3641Z"
        fill={colorCode}
      />
      <path
        d="M55 101.915C55 106.38 51.3609 110.061 46.9438 109.407C35.6256 107.731 25.0375 102.553 16.7248 94.4969C6.46438 84.5539 0.475932 71.0083 0.0271396 56.7276C-0.421653 42.4469 4.70444 28.552 14.3203 17.9843C22.1108 9.4227 32.3528 3.58943 43.5434 1.20623C47.9107 0.276157 51.7738 3.72117 52.0542 8.17758C52.3345 12.634 48.9055 16.392 44.6033 17.5876C37.6069 19.532 31.2398 23.4163 26.2801 28.8669C19.4913 36.3277 15.8723 46.1375 16.1892 56.2197C16.506 66.3019 20.7339 75.8651 27.9777 82.8848C33.2699 88.0133 39.8683 91.4901 46.973 92.9914C51.3417 93.9145 55 97.4498 55 101.915Z"
        fill={`${value === 2 ? colorCode : "black"}`}
        fillOpacity={`${value === 2 ? "0.9" : "0.1"}`}
      />
      <path
        d="M55 8.085C55 3.61978 58.6391 -0.0609987 63.0562 0.593013C74.3744 2.26884 84.9625 7.44749 93.2752 15.5031C103.536 25.4461 109.524 38.9917 109.973 53.2724C110.422 67.5531 105.296 81.448 95.6797 92.0157C87.8892 100.577 77.6472 106.411 66.4565 108.794C62.0892 109.724 58.2262 106.279 57.9458 101.822C57.6654 97.366 61.0945 93.608 65.3967 92.4124C72.3931 90.468 78.7602 86.5837 83.7199 81.1331C90.5087 73.6723 94.1277 63.8625 93.8108 53.7803C93.494 43.6981 89.2662 34.1349 82.0223 27.1152C76.7302 21.9867 70.1317 18.5099 63.027 17.0086C58.6583 16.0855 55 12.5502 55 8.085Z"
        fill={`${value >= 1 ? colorCode : "black"}`}
        fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
      />
      <path
        d="M53.6 56.8L51.45 54.65C51.2667 54.4667 51.0333 54.375 50.75 54.375C50.4667 54.375 50.2333 54.4667 50.05 54.65C49.8667 54.8333 49.775 55.0667 49.775 55.35C49.775 55.6333 49.8667 55.8667 50.05 56.05L52.9 58.9C53.1 59.1 53.3333 59.2 53.6 59.2C53.8667 59.2 54.1 59.1 54.3 58.9L59.95 53.25C60.1333 53.0667 60.225 52.8333 60.225 52.55C60.225 52.2667 60.1333 52.0333 59.95 51.85C59.7667 51.6667 59.5333 51.575 59.25 51.575C58.9667 51.575 58.7333 51.6667 58.55 51.85L53.6 56.8ZM55 65C53.6167 65 52.3167 64.7375 51.1 64.2125C49.8833 63.6875 48.825 62.975 47.925 62.075C47.025 61.175 46.3125 60.1167 45.7875 58.9C45.2625 57.6833 45 56.3833 45 55C45 53.6167 45.2625 52.3167 45.7875 51.1C46.3125 49.8833 47.025 48.825 47.925 47.925C48.825 47.025 49.8833 46.3125 51.1 45.7875C52.3167 45.2625 53.6167 45 55 45C56.3833 45 57.6833 45.2625 58.9 45.7875C60.1167 46.3125 61.175 47.025 62.075 47.925C62.975 48.825 63.6875 49.8833 64.2125 51.1C64.7375 52.3167 65 53.6167 65 55C65 56.3833 64.7375 57.6833 64.2125 58.9C63.6875 60.1167 62.975 61.175 62.075 62.075C61.175 62.975 60.1167 63.6875 58.9 64.2125C57.6833 64.7375 56.3833 65 55 65ZM55 63C57.2333 63 59.125 62.225 60.675 60.675C62.225 59.125 63 57.2333 63 55C63 52.7667 62.225 50.875 60.675 49.325C59.125 47.775 57.2333 47 55 47C52.7667 47 50.875 47.775 49.325 49.325C47.775 50.875 47 52.7667 47 55C47 57.2333 47.775 59.125 49.325 60.675C50.875 62.225 52.7667 63 55 63Z"
        fill="#F9FAFB"
      />
    </svg>
  );
};
export default DonutChart2;
