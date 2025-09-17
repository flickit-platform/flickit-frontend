import {IFlatGauge} from "@/types/index";


const FlatGauge2 =(props:IFlatGauge)=>{
    const { colorCode, value } = props;
    return (
        <svg width="138" height="12" viewBox="0 0 138 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="66" height="12" rx="6"
                  fill={`${value >= 1 ? colorCode : "black"}`}
                  fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
            />
            <rect x="72" width="66" height="12" rx="6"
                  fill={`${value === 2 ? colorCode : "black"}`}
                  fillOpacity={`${value === 2 ? "0.9" : "0.1"}`}
            />
        </svg>

    )
}
export default FlatGauge2