import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import EffectMaterial from "../../../assets/effect-material.esm.js";
import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/pagination";
import "../../../assets/effect-material.css";
import "../../../assets/MySwiper.css";

const PlaylistsSwiper = () => {
  const swiperParameters = {
    modules: [A11y, Pagination, EffectMaterial],
    slidesPerView: 2,
    spaceBetween: 16,
    grabCursor: true,
    rewind: true,
    effect: "material",
    pagination: { type: "progressbar", progressbarOpposite: true },
  };
  return (
    <>
      <Swiper style={{padding:"16px"}} {...swiperParameters}>
        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                data-swiper-material-scale="1.25"
                src="Screenshot 2024-11-23 142146.png"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-b827">
                <div className="swiper-slide-text swiper-slide-text-78dc">
                  Sabrina
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                data-swiper-material-scale="1.25"
                src="Screenshot 2024-11-23 141940.png"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-b827">
                <div className="swiper-slide-text swiper-slide-text-78dc">
                  Jane
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                  className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                  data-swiper-material-scale="1.25"
                  src="Screenshot 2024-11-23 142215.png"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-b827">
                <div className="swiper-slide-text swiper-slide-text-78dc">
                  Jessica
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                  className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                  data-swiper-material-scale="1.25"
                  src="Screenshot 2024-11-23 142228.png"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-b827">
                <div className="swiper-slide-text swiper-slide-text-78dc">
                  Kate
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                  className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                  data-swiper-material-scale="1.25"
                  src="Screenshot 2024-11-23 142242.png"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-b827">
                <div className="swiper-slide-text swiper-slide-text-78dc">
                  Margo
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                  className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                  data-swiper-material-scale="1.25"
                  src="https://studio.swiperjs.com/demo-images/models/15.jpg"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-b827">
                <div className="swiper-slide-text swiper-slide-text-78dc">
                  Mary
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                  className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                  data-swiper-material-scale="1.25"
                  src="https://studio.swiperjs.com/demo-images/models/16.jpg"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-b827">
                <div className="swiper-slide-text swiper-slide-text-78dc">
                  Helen
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                data-swiper-material-scale="1.25"
                src="https://studio.swiperjs.com/demo-images/models/17.jpg"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-609f">
                <div className="swiper-slide-text swiper-slide-text-66a3">
                  Nicole
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                data-swiper-material-scale="1.25"
                src="https://studio.swiperjs.com/demo-images/models/18.jpg"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-609f">
                <div className="swiper-slide-text swiper-slide-text-66a3">
                  Lara
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-1990">
          <div class="swiper-material-wrapper">
            <div class="swiper-material-content">
              <img
                className="swiper-slide-bg-image swiper-slide-bg-image-c61b"
                data-swiper-material-scale="1.25"
                src="https://studio.swiperjs.com/demo-images/models/19.jpg"
              />

              <div className="swiper-slide-content swiper-material-animate-opacity swiper-slide-content-609f">
                <div className="swiper-slide-text swiper-slide-text-66a3">
                  Kate
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default PlaylistsSwiper;
