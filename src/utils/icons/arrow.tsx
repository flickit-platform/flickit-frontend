import React from 'react';

const ArrowBtn = (props: any) => {
    const {color="#243342"} = props
    return (
        <svg width="70" height="70" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.0664 10L12.7735 15.2929C12.383 15.6834 11.7498 15.6834 11.3593 15.2929L6.06641 10" stroke={color} stroke-width="2" stroke-linecap="round"/>
        </svg>
    );
};

export default ArrowBtn;