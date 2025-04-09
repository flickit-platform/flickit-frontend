import {IFlatGauge} from "@/types/index";

const FlatGauge4 =(props:IFlatGauge)=>{
    const { colorCode, value } = props;
    return (
        <svg width="138" height="12" viewBox="0 0 138 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="31.5" height="12" rx="6"
                  fill={`${value >= 1 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
            />
            <rect x="35.5" width="31.5" height="12" rx="6"
                  fill={`${value >= 2 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
            />
            <rect x="71" width="31.5" height="12" rx="6"
                  fill={`${value >= 3 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 3 ? "0.9" : "0.1"}`}
            />
            <rect x="106.5" width="31.5" height="12" rx="6"
                  fill={`${value === 4 ? colorCode : "black"}`}
                  fillOpacity={`${value === 4 ? "0.9" : "0.1"}`}
            />
        </svg>
    )
}
export default FlatGauge4