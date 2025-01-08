import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Autoplay, Parallax, Keyboard} from "swiper/modules";
import {Key, useEffect, useState} from "react";
import EffectShutters from "../../assets/effect-shutters.esm.js";
import EffectSlicer from "../../assets/effect-slicer.esm.js";
import SwiperGL from "../../assets/swiper-gl.esm.js";
import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/autoplay";
import "../../assets/effect-shutters.css";
import "../../assets/effect-slicer.css";
import "../../assets/MySwiper.css";
import "../../assets/swiper-gl.css";
import {slideShowProps} from "../dashboard/client/ClientUI.tsx";

const ShowCaseSwiper = (props: slideShowProps) => {
    const [swiperRef, setSwiperRef] = useState(null);
    const [slideStyle, setSlideStyle] = useState("swiper-slide-bg-image");
    const [swiperKey, setSwiperKey] = useState(0);

    const getSwiperParameters = () => {
        let effect = "slide";
        let parallax = { enabled: false };

        if (props.transitionStyle === "shutters") {
            effect = "shutters";
            parallax = { enabled: true };
        } else if (props.transitionStyle === "slicer") {
            effect = "slicer";
        }else if (props.transitionStyle === "creative") {
            effect = "gl";
        }

        return {
            modules: [A11y, Autoplay, Keyboard, SwiperGL, EffectShutters, EffectSlicer, Parallax],
            loop: true,
            effect: effect,
            parallax: parallax,
            speed: props.transitionDuration * 1000,
            autoplay: { delay: props.interval * 1000 },
            keyboard: { enabled: true },
        };
    };

    useEffect(() => {
        if (props.transitionStyle === "shutters") {
            setSlideStyle("swiper-slide-bg-image swiper-shutters-image");
        } else if (props.transitionStyle === "slicer") {
            setSlideStyle("swiper-slide-bg-image swiper-slicer-image");
        } else if (props.transitionStyle === "creative") {
            setSlideStyle("swiper-slide-bg-image swiper-gl-image");
        } else {
            setSlideStyle("swiper-slide-bg-image");
        }

        // Trigger Swiper re-render with a new key
        setSwiperKey((prevKey) => prevKey + 1);
    }, [props.transitionStyle]);

    return (
        <Swiper
            {...getSwiperParameters()}
            key={swiperKey} // Forces remount when key changes
            onSwiper={setSwiperRef}
        >
            {props.fileNames.map((fileName, index) => (
                <SwiperSlide key={index}>
                    <img
                        className={slideStyle}
                        style={{objectFit: props.objectFit}}
                        src={`/${props.clientId}/${fileName}`}
                        alt={`Slide ${index}`}
                    />
                    {/*<Box className="swiper-slide-content">*/}
                    {/*    <Box className="swiper-slide-text">Olivia</Box>*/}
                    {/*</Box>*/}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
export default ShowCaseSwiper;