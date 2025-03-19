const FaWandMagicSparkles = (props: any) => {
  const { color } = props.styles;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_11630_18474)">
        <path
          d="M14 4.00001C14 2.8954 14.8954 2 16 2C14.8955 2 14 1.10457 14 0C14 1.10454 13.1046 2 12 2C13.1045 2 14 2.89537 14 4.00001ZM14.5 5.99998C14.5 6.82839 13.8284 7.49997 13 7.49997C13.8285 7.49997 14.5 8.17156 14.5 8.99997C14.5 8.17152 15.1716 7.49997 16 7.49997C15.1716 7.50001 14.5 6.82843 14.5 5.99998ZM7 5.99998C7 4.34312 8.34313 2.99999 9.99999 2.99999C8.34313 2.99999 7 1.65686 7 0C7 1.65686 5.65687 2.99999 4.00001 2.99999C5.65687 2.99999 7 4.34315 7 5.99998ZM11 2.99999L0 14L2 16L13 4.99999L11 2.99999ZM9.29297 6.20703L10.707 4.79298L11.207 5.29299L9.79297 6.70703L9.29297 6.20703Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_11630_18474">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FaWandMagicSparkles;
