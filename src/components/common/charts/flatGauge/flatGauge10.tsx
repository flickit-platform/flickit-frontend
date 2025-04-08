import {IFlatGauge} from "@/types/index";

const FlatGauge10 =(props:IFlatGauge)=>{
    const { colorCode, value } = props;
    return (
        <svg width="138" height="12" viewBox="0 0 138 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="12" height="12" rx="6"
                  fill={`${value >= 1 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
            />
            <rect x="14" width="12" height="12" rx="6"
                  fill={`${value >= 2 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
            />
            <rect x="28" width="12" height="12" rx="6"
                  fill={`${value >= 3 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 3 ? "0.9" : "0.1"}`}
            />
            <rect x="42" width="12" height="12" rx="6"
                  fill={`${value >= 4 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 4 ? "0.9" : "0.1"}`}
            />
            <rect x="56" width="12" height="12" rx="6"
                  fill={`${value >= 5 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 5 ? "0.9" : "0.1"}`}
            />
            <rect x="70" width="12" height="12" rx="6"
                  fill={`${value >= 6 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 6 ? "0.9" : "0.1"}`}
            />
            <rect x="84" width="12" height="12" rx="6"
                  fill={`${value >= 7 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 7 ? "0.9" : "0.1"}`}
            />
            <rect x="98" width="12" height="12" rx="6"
                  fill={`${value >= 8 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 8 ? "0.9" : "0.1"}`}
            />
            <rect x="112" width="12" height="12" rx="6"
                  fill={`${value >= 9 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 9 ? "0.9" : "0.1"}`}
            />
            <rect x="126" width="12" height="12" rx="6"
                  fill={`${value === 10 ? colorCode : "black"}`}
                  fillOpacity={`${value === 10 ? "0.9" : "0.1"}`}
            />
        </svg>
    )
}
export default FlatGauge10