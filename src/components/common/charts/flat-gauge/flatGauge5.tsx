import {IFlatGauge} from "@/types/index";

const FlatGauge5 =(props:IFlatGauge)=>{
    const { colorCode, value } = props;

    return (
        <svg width="138" height="12" viewBox="0 0 138 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24.4" height="12" rx="6"
                  fill={`${value >= 1 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
            />
            <rect x="28.4004" width="24.4" height="12" rx="6"
                  fill={`${value >= 2 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
            />
            <rect x="56.8008" width="24.4" height="12" rx="6"
                  fill={`${value >= 3 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 3 ? "0.9" : "0.1"}`}
            />
            <rect x="85.1992" width="24.4" height="12" rx="6"
                  fill={`${value >= 4 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 4 ? "0.9" : "0.1"}`}
            />
            <rect x="113.6" width="24.4" height="12" rx="6"
                  fill={`${value === 5 ? colorCode : "black"}`}
                  fillOpacity={`${value === 5 ? "0.9" : "0.1"}`}
            />
        </svg>
    )
}
export default FlatGauge5