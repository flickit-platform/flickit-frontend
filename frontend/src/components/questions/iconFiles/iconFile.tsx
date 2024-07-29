
export default function IconFile ({mainColor, backgroundColor, hover,downloadFile,item,setExpandedDeleteAttachmentDialog}: {mainColor: string, backgroundColor: string, hover:boolean,downloadFile:any,item:any,deleteAttachment:any}) {
    return (
        <div style={{position: 'relative'}}>
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_4089_8395)">
                    <rect width="60" height="60" rx="8" fill={mainColor}/>
                    {!hover && <path
                        d="M28.925 23.125L27.525 21.725C27.425 21.625 27.3167 21.55 27.2 21.5C27.0833 21.45 26.9625 21.425 26.8375 21.425C26.7125 21.425 26.5875 21.45 26.4625 21.5C26.3375 21.55 26.225 21.625 26.125 21.725C25.925 21.925 25.825 22.1625 25.825 22.4375C25.825 22.7125 25.925 22.95 26.125 23.15L28.25 25.3C28.35 25.4 28.4583 25.4708 28.575 25.5125C28.6917 25.5542 28.8167 25.575 28.95 25.575C29.0833 25.575 29.2083 25.5542 29.325 25.5125C29.4417 25.4708 29.55 25.4 29.65 25.3L33.875 21.075C34.075 20.875 34.175 20.6333 34.175 20.35C34.175 20.0667 34.075 19.825 33.875 19.625C33.675 19.425 33.4333 19.325 33.15 19.325C32.8667 19.325 32.625 19.425 32.425 19.625L28.925 23.125ZM24 30C23.45 30 22.9792 29.8042 22.5875 29.4125C22.1958 29.0208 22 28.55 22 28V12C22 11.45 22.1958 10.9792 22.5875 10.5875C22.9792 10.1958 23.45 10 24 10H31.175C31.4417 10 31.6958 10.05 31.9375 10.15C32.1792 10.25 32.3917 10.3917 32.575 10.575L37.425 15.425C37.6083 15.6083 37.75 15.8208 37.85 16.0625C37.95 16.3042 38 16.5583 38 16.825V28C38 28.55 37.8042 29.0208 37.4125 29.4125C37.0208 29.8042 36.55 30 36 30H24ZM31 16V12H24V28H36V17H32C31.7167 17 31.4792 16.9042 31.2875 16.7125C31.0958 16.5208 31 16.2833 31 16Z"
                        fill="white"/>}
                    {/*<path d="M11.2089 48V39.684H16.4649V40.968H12.7209V43.092H16.0449V44.376H12.7209V48H11.2089ZM19.7103 48H18.2583V41.724H19.7103V48ZM19.8663 39.888C19.8663 40.16 19.7783 40.376 19.6023 40.536C19.4263 40.696 19.2183 40.776 18.9783 40.776C18.7303 40.776 18.5183 40.696 18.3423 40.536C18.1663 40.376 18.0783 40.16 18.0783 39.888C18.0783 39.608 18.1663 39.388 18.3423 39.228C18.5183 39.068 18.7303 38.988 18.9783 38.988C19.2183 38.988 19.4263 39.068 19.6023 39.228C19.7783 39.388 19.8663 39.608 19.8663 39.888ZM24.2467 48.12C23.8147 48.112 23.4547 48.064 23.1667 47.976C22.8867 47.888 22.6627 47.764 22.4947 47.604C22.3267 47.436 22.2067 47.232 22.1347 46.992C22.0707 46.744 22.0387 46.464 22.0387 46.152V38.928L23.4907 38.688V45.876C23.4907 46.052 23.5027 46.2 23.5267 46.32C23.5587 46.44 23.6107 46.544 23.6827 46.632C23.7547 46.712 23.8507 46.776 23.9707 46.824C24.0987 46.864 24.2587 46.896 24.4507 46.92L24.2467 48.12ZM25.7772 44.892C25.7772 44.34 25.8572 43.856 26.0172 43.44C26.1852 43.024 26.4052 42.68 26.6772 42.408C26.9492 42.128 27.2612 41.92 27.6132 41.784C27.9652 41.64 28.3252 41.568 28.6932 41.568C29.5572 41.568 30.2292 41.836 30.7092 42.372C31.1972 42.908 31.4412 43.708 31.4412 44.772C31.4412 44.852 31.4372 44.944 31.4292 45.048C31.4292 45.144 31.4252 45.232 31.4172 45.312H27.2772C27.3172 45.816 27.4932 46.208 27.8052 46.488C28.1252 46.76 28.5852 46.896 29.1852 46.896C29.5372 46.896 29.8572 46.864 30.1452 46.8C30.4412 46.736 30.6732 46.668 30.8412 46.596L31.0332 47.784C30.9532 47.824 30.8412 47.868 30.6972 47.916C30.5612 47.956 30.4012 47.992 30.2172 48.024C30.0412 48.064 29.8492 48.096 29.6412 48.12C29.4332 48.144 29.2212 48.156 29.0052 48.156C28.4532 48.156 27.9732 48.076 27.5652 47.916C27.1572 47.748 26.8212 47.52 26.5572 47.232C26.2932 46.936 26.0972 46.592 25.9692 46.2C25.8412 45.8 25.7772 45.364 25.7772 44.892ZM29.9892 44.244C29.9892 44.044 29.9612 43.856 29.9052 43.68C29.8492 43.496 29.7652 43.34 29.6532 43.212C29.5492 43.076 29.4172 42.972 29.2572 42.9C29.1052 42.82 28.9212 42.78 28.7052 42.78C28.4812 42.78 28.2852 42.824 28.1172 42.912C27.9492 42.992 27.8052 43.1 27.6852 43.236C27.5732 43.372 27.4852 43.528 27.4212 43.704C27.3572 43.88 27.3132 44.06 27.2892 44.244H29.9892ZM35.9286 47.208C35.9286 47.488 35.8326 47.716 35.6406 47.892C35.4566 48.068 35.2326 48.156 34.9686 48.156C34.6966 48.156 34.4686 48.068 34.2846 47.892C34.1006 47.716 34.0086 47.488 34.0086 47.208C34.0086 46.928 34.1006 46.7 34.2846 46.524C34.4686 46.34 34.6966 46.248 34.9686 46.248C35.2326 46.248 35.4566 46.34 35.6406 46.524C35.8326 46.7 35.9286 46.928 35.9286 47.208ZM43.0926 47.208C43.0926 47.488 42.9966 47.716 42.8046 47.892C42.6206 48.068 42.3966 48.156 42.1326 48.156C41.8606 48.156 41.6326 48.068 41.4486 47.892C41.2646 47.716 41.1726 47.488 41.1726 47.208C41.1726 46.928 41.2646 46.7 41.4486 46.524C41.6326 46.34 41.8606 46.248 42.1326 46.248C42.3966 46.248 42.6206 46.34 42.8046 46.524C42.9966 46.7 43.0926 46.928 43.0926 47.208ZM39.5166 47.208C39.5166 47.488 39.4206 47.716 39.2286 47.892C39.0446 48.068 38.8206 48.156 38.5566 48.156C38.2846 48.156 38.0566 48.068 37.8726 47.892C37.6886 47.716 37.5966 47.488 37.5966 47.208C37.5966 46.928 37.6886 46.7 37.8726 46.524C38.0566 46.34 38.2846 46.248 38.5566 46.248C38.8206 46.248 39.0446 46.34 39.2286 46.524C39.4206 46.7 39.5166 46.928 39.5166 47.208Z" fill="white"/>*/}
                </g>
                <defs>
                    <clipPath id="clip0_4089_8395">
                        <rect width="60" height="60" rx="8" fill={backgroundColor}/>
                    </clipPath>
                </defs>
            </svg>
            {hover && (
                <div onClick={()=>downloadFile(item)} style={{position:'absolute',top:"7px",left:"7px",zIndex:1}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 15.575C11.8667 15.575 11.7417 15.5542 11.625 15.5125C11.5083 15.4708 11.4 15.4 11.3 15.3L7.7 11.7C7.5 11.5 7.40417 11.2667 7.4125 11C7.42083 10.7333 7.51667 10.5 7.7 10.3C7.9 10.1 8.1375 9.99583 8.4125 9.9875C8.6875 9.97917 8.925 10.075 9.125 10.275L11 12.15V5C11 4.71667 11.0958 4.47917 11.2875 4.2875C11.4792 4.09583 11.7167 4 12 4C12.2833 4 12.5208 4.09583 12.7125 4.2875C12.9042 4.47917 13 4.71667 13 5V12.15L14.875 10.275C15.075 10.075 15.3125 9.97917 15.5875 9.9875C15.8625 9.99583 16.1 10.1 16.3 10.3C16.4833 10.5 16.5792 10.7333 16.5875 11C16.5958 11.2667 16.5 11.5 16.3 11.7L12.7 15.3C12.6 15.4 12.4917 15.4708 12.375 15.5125C12.2583 15.5542 12.1333 15.575 12 15.575ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V16C4 15.7167 4.09583 15.4792 4.2875 15.2875C4.47917 15.0958 4.71667 15 5 15C5.28333 15 5.52083 15.0958 5.7125 15.2875C5.90417 15.4792 6 15.7167 6 16V18H18V16C18 15.7167 18.0958 15.4792 18.2875 15.2875C18.4792 15.0958 18.7167 15 19 15C19.2833 15 19.5208 15.0958 19.7125 15.2875C19.9042 15.4792 20 15.7167 20 16V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
                            fill="white"/>
                    </svg>
                </div>
            )}
            {hover && (
                <div  onClick={()=>setExpandedDeleteAttachmentDialog({expended:true,id:item.id})} style={{position:'absolute',width:"20px",height:"20px",top:"-8px",
                    right:"-8px",zIndex:1,borderRadius:"100%", background:mainColor}}>
                    <div style={{
                        width: "20px", height: "20px", borderRadius: "100%",
                        background: "rgba(0, 0, 0, 0.6)",display:"flex",justifyContent:"center",
                        alignItems:"center"
                    }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.5 3.205L8.795 2.5L6 5.295L3.205 2.5L2.5 3.205L5.295 6L2.5 8.795L3.205 9.5L6 6.705L8.795 9.5L9.5 8.795L6.705 6L9.5 3.205Z"
                                fill="white"/>
                        </svg>
                    </div>
                </div>
            )}
            <p style={{position: 'absolute', color: "white", top: "15px", left: "2px", fontSize: '9px'}}
               color={"#fff"}>salam</p>
        </div>

    )
}