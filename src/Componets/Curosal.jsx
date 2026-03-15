
import React, { useContext, useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import serverUrl from '../services/serverUrl';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { displayadvertisContext } from '../Context/OtherPurpuseContextApi';

function Curosal() {

  const { advertisresponse } = useContext(displayadvertisContext)

  return (
    <div>
      {advertisresponse?.length > 0 && <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{

          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {advertisresponse.map(adds =>
          <SwiperSlide key={adds._id}>
            <img className='object-cover w-full' src={`${serverUrl}/uploads/${adds.adsimg}`} alt="" />
          </SwiperSlide>
        )}


      </Swiper>}
    </div>
  )
}

export default Curosal