import {IFlatGauge} from "@/types/index";

const FlatGauge7 =(props:IFlatGauge)=>{
    const { colorCode, value } = props;

    return (
        <svg width="138" height="12" viewBox="0 0 138 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="16.2857" height="12" rx="6"
                  fill={`${value >= 1 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
            />
            <rect x="20.2852" width="16.2857" height="12" rx="6"
                  fill={`${value >= 2 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
            />
            <rect x="40.5723" width="16.2857" height="12" rx="6"
                  fill={`${value >= 3 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 3 ? "0.9" : "0.1"}`}
            />
            <rect x="60.8574" width="16.2857" height="12" rx="6"
                  fill={`${value >= 4 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 4 ? "0.9" : "0.1"}`}
            />
            <rect x="81.1426" width="16.2857" height="12" rx="6"
                  fill={`${value >= 5 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 5 ? "0.9" : "0.1"}`}
            />
            <rect x="101.428" width="16.2857" height="12" rx="6"
                  fill={`${value >= 6 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 6 ? "0.9" : "0.1"}`}
            />
            <rect x="121.715" width="16.2857" height="12" rx="6"
                  fill={`${value == 7 ? colorCode : "black"}`}
                  fillOpacity={`${value == 7 ? "0.9" : "0.1"}`}
            />
        </svg>
    )
}
export default FlatGauge7