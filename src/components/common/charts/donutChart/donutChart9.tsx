import { IFlatGauge } from "@types";

const DonutChart9 = (props: IFlatGauge) => {
  const { colorCode, value, height } = props;
  return (
    <svg
      height={height ? height : "110"}
      viewBox= "0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M54.5949 79.3638C67.9258 79.3638 78.7327 68.5569 78.7327 55.226C78.7327 41.895 67.9258 31.0881 54.5949 31.0881C41.2639 31.0881 30.457 41.895 30.457 55.226C30.457 68.5569 41.2639 79.3638 54.5949 79.3638Z"
        fill={colorCode}
      />
      <path
        d="M53.6 56.8L51.45 54.65C51.2667 54.4667 51.0333 54.375 50.75 54.375C50.4667 54.375 50.2333 54.4667 50.05 54.65C49.8667 54.8333 49.775 55.0667 49.775 55.35C49.775 55.6333 49.8667 55.8667 50.05 56.05L52.9 58.9C53.1 59.1 53.3333 59.2 53.6 59.2C53.8667 59.2 54.1 59.1 54.3 58.9L59.95 53.25C60.1333 53.0667 60.225 52.8333 60.225 52.55C60.225 52.2667 60.1333 52.0333 59.95 51.85C59.7667 51.6667 59.5333 51.575 59.25 51.575C58.9667 51.575 58.7333 51.6667 58.55 51.85L53.6 56.8ZM55 65C53.6167 65 52.3167 64.7375 51.1 64.2125C49.8833 63.6875 48.825 62.975 47.925 62.075C47.025 61.175 46.3125 60.1167 45.7875 58.9C45.2625 57.6833 45 56.3833 45 55C45 53.6167 45.2625 52.3167 45.7875 51.1C46.3125 49.8833 47.025 48.825 47.925 47.925C48.825 47.025 49.8833 46.3125 51.1 45.7875C52.3167 45.2625 53.6167 45 55 45C56.3833 45 57.6833 45.2625 58.9 45.7875C60.1167 46.3125 61.175 47.025 62.075 47.925C62.975 48.825 63.6875 49.8833 64.2125 51.1C64.7375 52.3167 65 53.6167 65 55C65 56.3833 64.7375 57.6833 64.2125 58.9C63.6875 60.1167 62.975 61.175 62.075 62.075C61.175 62.975 60.1167 63.6875 58.9 64.2125C57.6833 64.7375 56.3833 65 55 65ZM55 63C57.2333 63 59.125 62.225 60.675 60.675C62.225 59.125 63 57.2333 63 55C63 52.7667 62.225 50.875 60.675 49.325C59.125 47.775 57.2333 47 55 47C52.7667 47 50.875 47.775 49.325 49.325C47.775 50.875 47 52.7667 47 55C47 57.2333 47.775 59.125 49.325 60.675C50.875 62.225 52.7667 63 55 63Z"
        fill="#F9FAFB"
      />
      <path
        d="M24.8436 19.061C21.9734 15.6405 22.3952 10.4817 26.1993 8.14354C31.4327 4.92681 37.1691 2.60915 43.1683 1.28765C47.5289 0.327069 51.4159 3.74494 51.7274 8.19928C52.0389 12.6536 48.6363 16.4356 44.3425 17.6612C41.7031 18.4146 39.1507 19.4458 36.7286 20.7374C32.7886 22.8384 27.7138 22.4816 24.8436 19.061Z"
        fill={`${value === 9 ? colorCode : "black"}`}
        fillOpacity={`${value === 9 ? "0.9" : "0.1"}`}
      />
      <path
        d="M8.79775 46.8533C4.40036 46.0779 1.40752 41.8549 2.81866 37.6186C4.76 31.7905 7.66458 26.3277 11.4107 21.4593C14.1337 17.9204 19.3083 18.0401 22.4101 21.2522C25.5119 24.4642 25.3364 29.5485 22.835 33.2473C21.2973 35.521 20.0049 37.9517 18.9797 40.4979C17.312 44.64 13.1951 47.6287 8.79775 46.8533Z"
        fill={`${value >= 8 ? colorCode : "black"}`}
        fillOpacity={`${value >= 8 ? "0.9" : "0.1"}`}
      />
      <path
        d="M14.3704 78.4575C10.5034 80.6901 5.49631 79.3789 3.85421 75.2266C1.59512 69.5141 0.308793 63.4624 0.0491022 57.325C-0.139664 52.8637 3.90124 49.6293 8.34201 50.0961C12.7828 50.5628 15.9164 54.5704 16.3778 59.0117C16.6614 61.742 17.2337 64.4346 18.0851 67.0442C19.4701 71.2892 18.2374 76.2249 14.3704 78.4575Z"
        fill={`${value >= 7 ? colorCode : "black"}`}
        fillOpacity={`${value >= 7 ? "0.9" : "0.1"}`}
      />
      <path
        d="M38.9541 99.0857C37.4269 103.282 32.7484 105.496 28.8215 103.37C23.419 100.446 18.5436 96.6374 14.3996 92.1028C11.3874 88.8066 12.4039 83.7315 16.1057 81.2345C19.8075 78.7376 24.7841 79.7934 27.9924 82.8991C29.9646 84.8082 32.1338 86.503 34.4634 87.9548C38.253 90.3164 40.4813 94.8897 38.9541 99.0857Z"
        fill={`${value >= 6 ? colorCode : "black"}`}
        fillOpacity={`${value >= 6 ? "0.9" : "0.1"}`}
      />
      <path
        d="M71.0459 99.0857C72.5731 103.282 70.4123 107.985 66.0379 108.881C60.02 110.114 53.8368 110.33 47.7475 109.52C43.3213 108.931 40.8377 104.39 42.0685 100.098C43.2993 95.8053 47.7901 93.4152 52.2441 93.7321C54.9821 93.9269 57.7333 93.8308 60.451 93.4455C64.872 92.8187 69.5187 94.8897 71.0459 99.0857Z"
        fill={`${value >= 5 ? colorCode : "black"}`}
        fillOpacity={`${value >= 5 ? "0.9" : "0.1"}`}
      />
      <path
        d="M95.6296 78.4575C99.4966 80.6901 100.865 85.682 98.0896 89.1803C94.272 93.9929 89.6743 98.1328 84.4889 101.426C80.7198 103.82 75.8982 101.938 74.082 97.859C72.2659 93.7798 74.1698 89.0622 77.7854 86.442C80.008 84.8312 82.0538 82.9892 83.888 80.9471C86.8718 77.6252 91.7626 76.2249 95.6296 78.4575Z"
        fill={`${value >= 4 ? colorCode : "black"}`}
        fillOpacity={`${value >= 4 ? "0.9" : "0.1"}`}
      />
      <path
        d="M101.202 46.8533C105.6 46.0779 109.856 49.0226 109.979 53.4861C110.148 59.6267 109.287 65.7534 107.432 71.6096C106.084 75.8663 101.18 77.5236 97.1669 75.5662C93.1536 73.6088 91.5796 68.7711 92.6651 64.4398C93.3324 61.7772 93.7155 59.0512 93.808 56.3078C93.9584 51.8451 96.8049 47.6287 101.202 46.8533Z"
        fill={`${value >= 3 ? colorCode : "black"}`}
        fillOpacity={`${value >= 3 ? "0.9" : "0.1"}`}
      />
      <path
        d="M85.1564 19.061C88.0266 15.6405 93.1802 15.1601 96.1434 18.5003C100.22 23.0957 103.499 28.3424 105.842 34.0209C107.545 38.1486 104.854 42.57 100.521 43.6502C96.1888 44.7305 91.8735 42.0363 89.9209 38.0206C88.7206 35.5521 87.2618 33.2175 85.5693 31.0566C82.816 27.5412 82.2862 22.4816 85.1564 19.061Z"
        fill={`${value >= 2 ? colorCode : "black"}`}
        fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
      />
      <path
        d="M55 8.085C55 3.61978 58.6391 -0.0609039 63.0562 0.593153C69.1329 1.49296 75.0169 3.40482 80.462 6.24865C84.4199 8.31579 85.2005 13.4325 82.576 17.045C79.9514 20.6574 74.9138 21.3674 70.8369 19.5463C68.3306 18.4268 65.7125 17.5761 63.0269 17.0087C58.6581 16.0856 55 12.5502 55 8.085Z"
        fill={`${value >= 1 ? colorCode : "black"}`}
        fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
      />
    </svg>
  );
};
export default DonutChart9;
