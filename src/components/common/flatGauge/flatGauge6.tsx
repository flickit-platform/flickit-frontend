import {IFlatGauge} from "@types";

const FlatGauge6 =(props:IFlatGauge)=>{
    const { colorCode, value } = props;
    return (
        <svg width="138" height="12" viewBox="0 0 138 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="19.6667" height="12" rx="6"
                  fill={`${value >= 1 ? colorCode : "black"}`}
                  fill-opacity={`${value >= 1 ? "0.9" : "0.1"}`}
            />
            <rect x="23.666" width="19.6667" height="12" rx="6"
                  fill={`${value >= 2 ? colorCode : "black"}`}
                  fill-opacity={`${value >= 2 ? "0.9" : "0.1"}`}
            />
            <rect x="47.334" width="19.6667" height="12" rx="6"
                  fill={`${value >= 3 ? colorCode : "black"}`}
                  fill-opacity={`${value >= 3 ? "0.9" : "0.1"}`}
            />
            <rect x="71" width="19.6667" height="12" rx="6"
                  fill={`${value >= 4 ? colorCode : "black"}`}
                  fill-opacity={`${value >= 4 ? "0.9" : "0.1"}`}
            />
            <rect x="94.666" width="19.6667" height="12" rx="6"
                  fill={`${value >= 5 ? colorCode : "black"}`}
                  fill-opacity={`${value >= 5 ? "0.9" : "0.1"}`}
            />
            <rect x="118.334" width="19.6667" height="12" rx="6"
                  fill={`${value === 6 ? colorCode : "black"}`}
                  fill-opacity={`${value === 6 ? "0.9" : "0.1"}`}
            />
        </svg>
    )
}
export default FlatGauge6