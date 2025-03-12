export const SpaceSmallIcon = (props: any) =>{
    const {type, allowCreateBasic} = props
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.99967 9.93685L8.58301 11.0202C8.49967 11.0896 8.41634 11.0931 8.33301 11.0306C8.24967 10.9681 8.2219 10.8882 8.24967 10.791L8.79134 9.04102L7.33301 7.87435C7.26356 7.8049 7.24273 7.72504 7.27051 7.63477C7.29829 7.54449 7.36079 7.49935 7.45801 7.49935H9.24967L9.79134 5.79102C9.81912 5.69379 9.88856 5.64518 9.99967 5.64518C10.1108 5.64518 10.1802 5.69379 10.208 5.79102L10.7497 7.49935H12.5205C12.6177 7.49935 12.6837 7.54449 12.7184 7.63477C12.7531 7.72504 12.7358 7.8049 12.6663 7.87435L11.1872 9.04102L11.7288 10.791C11.7566 10.8882 11.7288 10.9681 11.6455 11.0306C11.5622 11.0931 11.4788 11.0896 11.3955 11.0202L9.99967 9.93685ZM9.99967 17.4993L6.10384 18.791C5.82606 18.8882 5.57259 18.8535 5.34342 18.6868C5.11426 18.5202 4.99967 18.298 4.99967 18.0202V12.7285C4.4719 12.1452 4.06217 11.4785 3.77051 10.7285C3.47884 9.97852 3.33301 9.1799 3.33301 8.33268C3.33301 6.47157 3.97884 4.89518 5.27051 3.60352C6.56217 2.31185 8.13856 1.66602 9.99967 1.66602C11.8608 1.66602 13.4372 2.31185 14.7288 3.60352C16.0205 4.89518 16.6663 6.47157 16.6663 8.33268C16.6663 9.1799 16.5205 9.97852 16.2288 10.7285C15.9372 11.4785 15.5275 12.1452 14.9997 12.7285V18.0202C14.9997 18.298 14.8851 18.5202 14.6559 18.6868C14.4268 18.8535 14.1733 18.8882 13.8955 18.791L9.99967 17.4993ZM9.99967 13.3327C11.3886 13.3327 12.5691 12.8466 13.5413 11.8743C14.5136 10.9021 14.9997 9.72157 14.9997 8.33268C14.9997 6.94379 14.5136 5.76324 13.5413 4.79102C12.5691 3.81879 11.3886 3.33268 9.99967 3.33268C8.61079 3.33268 7.43023 3.81879 6.45801 4.79102C5.48579 5.76324 4.99967 6.94379 4.99967 8.33268C4.99967 9.72157 5.48579 10.9021 6.45801 11.8743C7.43023 12.8466 8.61079 13.3327 9.99967 13.3327ZM6.66634 16.6868L9.99967 15.8327L13.333 16.6868V14.1035C12.8469 14.3813 12.3226 14.6 11.7601 14.7598C11.1976 14.9195 10.6108 14.9993 9.99967 14.9993C9.38856 14.9993 8.80176 14.9195 8.23926 14.7598C7.67676 14.6 7.15245 14.3813 6.66634 14.1035V16.6868Z" fill={type == "PREMIUM" ? "url(#paint0_linear_11642_19953)" : type == "BASIC" && allowCreateBasic ? "#2B333B" : "#3D4D5C"}  fill-opacity={type == "BASIC" && !allowCreateBasic ? "0.5" : "1"}/>
            {type == "PREMIUM"}  <defs>
                <linearGradient id="paint0_linear_11642_19953" x1="3.33301" y1="18.8447" x2="17.775" y2="17.8558" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1B4D7E"/>
                    <stop offset="0.33" stop-color="#2D80D2"/>
                    <stop offset="1" stop-color="#1B4D7E"/>
                </linearGradient>
            </defs>
        </svg>
    )
}