// @ts-nocheck
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Pagination, Mousewheel} from "swiper/modules";
import EffectMaterial from "../../../assets/effect-material.esm.js";
import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/pagination";
import "../../../assets/effect-material.css";
import "../../../assets/MySwiper.css";
import "swiper/css/mousewheel";
import Box from "@mui/material/Box";

interface PlaylistsSwiperProps {
    name: string;
    filePaths: string[];
}

const PlaylistsSwiper = (props : PlaylistsSwiperProps) => {
    const swiperParameters = {
        modules: [A11y, Pagination, EffectMaterial, Mousewheel],
        slidesPerView: 2,
        spaceBetween: 16,
        grabCursor: true,
        rewind: true,
        mousewheel: true,
        effect: "material",
        pagination: {type: "progressbar", progressbarOpposite: true},
    };

    if (props.filePaths.length === 0) {
        return (
            <Box fontSize={20} height={'85%'} textAlign={"center"}>
                No images found, click to edit playlist
            </Box>
        );
    }

    return (
        <Swiper style={{padding: 16,height:'85%'}} {...swiperParameters}>
            {props.filePaths.map((filePath, index) => {
                return (
                    <SwiperSlide key={index}>
                        <div class="swiper-material-wrapper">
                            <div class="swiper-material-content">
                                <img
                                    className="swiper-slide-bg-image"
                                    data-swiper-material-scale="1.25"
                                    src={`/playlists/${props.name}/${filePath}`}
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}

export default PlaylistsSwiper;
