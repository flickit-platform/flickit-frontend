import { IFlatGauge } from "@types";

const DonutChart3 = (props: IFlatGauge) => {
  const { colorCode, value, height } = props;
  return (
    <svg
      height={height ?? "110"}
      viewBox= "0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M54.5949 79.3638C67.9258 79.3638 78.7327 68.5569 78.7327 55.226C78.7327 41.895 67.9258 31.0881 54.5949 31.0881C41.2639 31.0881 30.457 41.895 30.457 55.226C30.457 68.5569 41.2639 79.3638 54.5949 79.3638Z"
        fill={colorCode}
      />
      <path
        d="M14.3704 78.4575C10.5034 80.6901 5.49641 79.379 3.8543 75.2267C1.45795 69.1672 0.149423 62.7094 0.0120624 56.1518C-0.181951 46.8897 1.96676 37.7286 6.25881 29.5187C10.5509 21.3088 16.8472 14.316 24.5635 9.18933C30.0266 5.55964 36.0762 2.94859 42.4196 1.4581C46.7664 0.436741 50.7006 3.79997 51.0743 8.24954C51.4479 12.6991 48.0985 16.5282 43.8223 17.8136C40.18 18.9084 36.7041 20.5367 33.5118 22.6577C28.0641 26.2771 23.6189 31.214 20.5887 37.0102C17.5585 42.8064 16.0415 49.2741 16.1785 55.8132C16.2588 59.645 16.9054 63.4285 18.0852 67.0442C19.4702 71.2892 18.2374 76.2249 14.3704 78.4575Z"
        fill={`${value === 3 ? colorCode : "black"}`}
        fillOpacity={`${value === 3 ? "0.9" : "0.1"}`}
      />
      <path
        d="M95.6296 78.4575C99.4966 80.6901 100.865 85.6819 98.0897 89.1801C94.0401 94.2852 89.1018 98.6473 83.4915 102.045C75.5673 106.844 66.5592 109.564 57.3032 109.952C48.0471 110.34 38.8431 108.383 30.5451 104.264C24.6701 101.348 19.3841 97.4142 14.9216 92.6659C11.8636 89.4121 12.8092 84.3234 16.4758 81.775C20.1424 79.2267 25.1332 80.2127 28.3845 83.2733C31.1538 85.8803 34.3019 88.0764 37.7348 89.7805C43.5932 92.6886 50.0913 94.0698 56.626 93.7959C63.1608 93.522 69.5205 91.6019 75.115 88.2138C78.3933 86.2284 81.3465 83.7766 83.888 80.9471C86.8718 77.6251 91.7626 76.2249 95.6296 78.4575Z"
        fill={`${value >= 2 ? colorCode : "black"}`}
        fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
      />
      <path
        d="M55 8.085C55 3.61978 58.639 -0.0608642 63.056 0.593184C69.5019 1.54764 75.7488 3.64331 81.4965 6.80313C89.6147 11.2662 96.4741 17.7075 101.438 25.5295C106.402 33.3515 109.31 42.3006 109.891 51.5465C110.303 58.0926 109.54 64.6372 107.659 70.876C106.37 75.1511 101.49 76.8766 97.45 74.9754C93.4097 73.0742 91.7683 68.259 92.7932 63.913C93.6662 60.2112 93.994 56.3869 93.7534 52.5618C93.3427 46.0343 91.2898 39.7162 87.7852 34.1938C84.2807 28.6715 79.438 24.1239 73.7065 20.973C70.348 19.1266 66.748 17.7949 63.0268 17.0087C58.658 16.0856 55 12.5502 55 8.085Z"
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
export default DonutChart3;
