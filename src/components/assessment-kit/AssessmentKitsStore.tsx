import React, {useEffect, useRef, useState} from 'react';
import Box from "@mui/material/Box";
import './Carousel.css';
import ArrowBtn from "@utils/icons/arrow";
import {theme} from "@config/theme";
import Button from "@mui/material/Button";
import kitStore from "@assets/svg/kitStore1.svg"

const images = [
    kitStore,
    kitStore
];

const AssessmentKitsStore = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<any>(null);
    const startXRef = useRef(null);

    const delay = 10000;

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            nextImage();
        }, delay);

        return () => resetTimeout();
    }, [currentIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e:any) => {
            if (e.key === 'ArrowLeft') prevImage();
            else if (e.key === 'ArrowRight') nextImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const nextImage = () => {
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    // Mouse drag/swipe support
    const handleMouseDown = (e:any) => {
        startXRef.current = e.clientX;
    };

    const handleMouseUp = (e:any) => {
        if (startXRef.current === null) return;
        const diff = e.clientX - startXRef.current;
        if (diff > 50) prevImage();
        else if (diff < -50) nextImage();
        startXRef.current = null;
    };

    return (
        <Box
            className="carousel"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <Box
                className="carousel-inner"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        className="carousel-image"
                        alt={`Slide ${i + 1}`}
                        draggable="false"
                    />
                ))}
            </Box>
            {/*<Box sx={{*/}
            {/*      backgroundImage: "linear-gradient(to right, #0E2842, #1B4D7E4D )",*/}
            {/*      opacity: "30%",*/}
            {/*      position: "absolute",*/}
            {/*      left : 0,*/}
            {/*      top: 0,*/}
            {/*      width:"7%",*/}
            {/*      height: "100%"*/}
            {/*}}/>*/}
                <Button className="arrow left" onClick={prevImage}>
                    <ArrowBtn color={theme.palette.primary.dark} />
                </Button>
            {/*<Box sx={{*/}
            {/*    backgroundImage: "linear-gradient(to right,#1B4D7E4D, #0E2842 )",*/}
            {/*    opacity: "30%",*/}
            {/*    position: "absolute",*/}
            {/*    right : 0,*/}
            {/*    top: 0,*/}
            {/*    width:"7%",*/}
            {/*    height: "100%"*/}
            {/*}}/>*/}

            <Button className="arrow right" onClick={nextImage}>
               <ArrowBtn color={theme.palette.primary.dark} height={"40px"} />
            </Button>

            <Box className="dots">
                {images.map((_, i) => (
                    <Box
                        key={i}
                        className={`dot ${currentIndex === i ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(i)}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default AssessmentKitsStore;