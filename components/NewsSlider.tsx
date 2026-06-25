"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface News {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  views?: number;
}

export default function NewsSlider() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();

        if (data.success) {
          setNews(data.data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        Belum ada berita tersedia
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      spaceBetween={24}
      breakpoints={{
        320: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      className="pb-12"
    >
      {news.map((item) => (
        <SwiperSlide key={item._id}>
          <Link href={`/kegiatan/${item._id}`}>
            <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="relative h-56 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>

              <div className="p-5">

                <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  {item.category}
                </span>

                <h3 className="mt-3 line-clamp-2 text-xl font-bold text-gray-800">
                  {item.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                  {item.excerpt}
                </p>

                <div className="mt-4 flex items-center justify-between">

                  <span className="text-xs text-gray-500">
                    {new Date(item.publishedAt).toLocaleDateString("id-ID")}
                  </span>

                  <span className="font-semibold text-red-700">
                    Baca →
                  </span>

                </div>

              </div>

            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}