import {IFlatGauge} from "@types";


const DonutChart6 =(props:IFlatGauge)=>{
    const { colorCode, value } = props;
    return (
        <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M54.5949 79.3638C67.9258 79.3638 78.7327 68.5569 78.7327 55.226C78.7327 41.895 67.9258 31.0881 54.5949 31.0881C41.2639 31.0881 30.457 41.895 30.457 55.226C30.457 68.5569 41.2639 79.3638 54.5949 79.3638Z" fill={colorCode}/>
            <path d="M53.6 56.8L51.45 54.65C51.2667 54.4667 51.0333 54.375 50.75 54.375C50.4667 54.375 50.2333 54.4667 50.05 54.65C49.8667 54.8333 49.775 55.0667 49.775 55.35C49.775 55.6333 49.8667 55.8667 50.05 56.05L52.9 58.9C53.1 59.1 53.3333 59.2 53.6 59.2C53.8667 59.2 54.1 59.1 54.3 58.9L59.95 53.25C60.1333 53.0667 60.225 52.8333 60.225 52.55C60.225 52.2667 60.1333 52.0333 59.95 51.85C59.7667 51.6667 59.5333 51.575 59.25 51.575C58.9667 51.575 58.7333 51.6667 58.55 51.85L53.6 56.8ZM55 65C53.6167 65 52.3167 64.7375 51.1 64.2125C49.8833 63.6875 48.825 62.975 47.925 62.075C47.025 61.175 46.3125 60.1167 45.7875 58.9C45.2625 57.6833 45 56.3833 45 55C45 53.6167 45.2625 52.3167 45.7875 51.1C46.3125 49.8833 47.025 48.825 47.925 47.925C48.825 47.025 49.8833 46.3125 51.1 45.7875C52.3167 45.2625 53.6167 45 55 45C56.3833 45 57.6833 45.2625 58.9 45.7875C60.1167 46.3125 61.175 47.025 62.075 47.925C62.975 48.825 63.6875 49.8833 64.2125 51.1C64.7375 52.3167 65 53.6167 65 55C65 56.3833 64.7375 57.6833 64.2125 58.9C63.6875 60.1167 62.975 61.175 62.075 62.075C61.175 62.975 60.1167 63.6875 58.9 64.2125C57.6833 64.7375 56.3833 65 55 65ZM55 63C57.2333 63 59.125 62.225 60.675 60.675C62.225 59.125 63 57.2333 63 55C63 52.7667 62.225 50.875 60.675 49.325C59.125 47.775 57.2333 47 55 47C52.7667 47 50.875 47.775 49.325 49.325C47.775 50.875 47 52.7667 47 55C47 57.2333 47.775 59.125 49.325 60.675C50.875 62.225 52.7667 63 55 63Z" fill="#F9FAFB"/>
            <path d="M14.3704 31.5425C10.5034 29.3099 9.13539 24.3181 11.9103 20.8198C15.9599 15.7148 20.8982 11.3527 26.5085 7.95495C32.1189 4.55722 38.2725 2.2018 44.6727 0.978253C49.0585 0.139814 52.8485 3.66485 53.0354 8.12615C53.2224 12.5875 49.7156 16.273 45.3894 17.3781C41.7043 18.3195 38.1633 19.8008 34.885 21.7862C31.6068 23.7716 28.6535 26.2234 26.112 29.0529C23.1282 32.3749 18.2374 33.7751 14.3704 31.5425Z"
                  fill={`${value === 6 ? colorCode : "black"}`}
                  fillOpacity={`${value === 6 ? "0.9" : "0.1"}`}
            />
            <path d="M14.3704 78.4575C10.5034 80.6901 5.49641 79.379 3.8543 75.2267C1.45795 69.1672 0.149423 62.7094 0.0120624 56.1518C-0.125299 49.5943 0.911653 43.0874 3.05216 36.9328C4.51894 32.7154 9.46667 31.1957 13.4238 33.2645C17.3809 35.3332 18.8192 40.2129 17.6132 44.5121C16.5859 48.1742 16.0983 51.9814 16.1785 55.8132C16.2588 59.645 16.9054 63.4285 18.0852 67.0442C19.4702 71.2892 18.2374 76.2249 14.3704 78.4575Z"
                  fill={`${value >= 5 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 5 ? "0.9" : "0.1"}`}
            />
            <path d="M55 101.915C55 106.38 51.361 110.061 46.944 109.407C40.4981 108.452 34.2512 106.357 28.5035 103.197C22.7559 100.037 17.6392 95.8856 13.3794 90.9546C10.4604 87.5756 11.6182 82.5309 15.3884 80.1383C19.1585 77.7457 24.1036 78.9399 27.2239 82.134C29.8816 84.8547 32.935 87.1806 36.2935 89.027C39.652 90.8734 43.252 92.2051 46.9732 92.9913C51.342 93.9144 55 97.4498 55 101.915Z"
                  fill={`${value >= 4 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 4 ? "0.9" : "0.1"}`}
            />
            <path d="M95.6296 78.4575C99.4966 80.6901 100.865 85.6819 98.0897 89.1801C94.0401 94.2852 89.1018 98.6473 83.4915 102.045C77.8811 105.443 71.7275 107.798 65.3273 109.022C60.9415 109.86 57.1516 106.335 56.9646 101.874C56.7776 97.4125 60.2844 93.727 64.6107 92.6219C68.2957 91.6805 71.8367 90.1992 75.115 88.2138C78.3933 86.2284 81.3465 83.7766 83.888 80.9471C86.8718 77.6251 91.7626 76.2249 95.6296 78.4575Z"
                  fill={`${value >= 3 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 3 ? "0.9" : "0.1"}`}
            />
            <path d="M95.6296 31.5425C99.4966 29.3099 104.504 30.621 106.146 34.7733C108.542 40.8329 109.851 47.2906 109.988 53.8482C110.125 60.4057 109.088 66.9126 106.948 73.0672C105.481 77.2846 100.533 78.8043 96.5762 76.7355C92.6191 74.6668 91.1808 69.7871 92.3868 65.4879C93.4141 61.8258 93.9017 58.0186 93.8215 54.1868C93.7412 50.3551 93.0946 46.5715 91.9148 42.9558C90.5298 38.7108 91.7626 33.7751 95.6296 31.5425Z"
                  fill={`${value >= 2 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
            />
            <path d="M55 8.085C55 3.61978 58.639 -0.0608642 63.056 0.593184C69.5019 1.54764 75.7488 3.64331 81.4965 6.80313C87.2441 9.96295 92.3608 14.1144 96.6206 19.0454C99.5396 22.4244 98.3818 27.4691 94.6116 29.8617C90.8415 32.2543 85.8964 31.0601 82.7761 27.866C80.1184 25.1453 77.065 22.8194 73.7065 20.973C70.348 19.1266 66.748 17.7949 63.0268 17.0087C58.658 16.0856 55 12.5502 55 8.085Z"
                  fill={`${value >= 1 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
            />
        </svg>
    )
}
export default DonutChart6