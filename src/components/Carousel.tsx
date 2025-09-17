import React, { FunctionComponent, useEffect, useState } from 'react';
import Post, { PostProps } from './Post';
import settings from './../settings.json';
import { listenToData, appReady } from '../api/process';

const validateLocalStorage = () => {
  const storedSlides = localStorage.getItem("slides");
  if (storedSlides) {
    try {
      const parsedSlides = JSON.parse(storedSlides);
      if (!Array.isArray(parsedSlides)) {
        localStorage.removeItem("slides");
      }
      parsedSlides.forEach((slide: PostProps) => {
        if (
          typeof slide.id !== "string" ||
          typeof slide.media_url !== "string" ||
          typeof slide.timestamp !== "string" ||
          typeof slide.likes !== "number" ||
          typeof slide.caption !== "string" ||
          isNaN(Date.parse(slide.timestamp + "000"))
        ) {
          throw new Error("Invalid slide format");
        }
      });
    } catch {
      localStorage.removeItem("slides");
    }
  }
};

const Carousel: FunctionComponent = () => {
  const { maxShownImages, secondsPerSlide } = settings;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<PostProps[]>([]);

  useEffect(() => {
    validateLocalStorage();
    const storedSlides = localStorage.getItem("slides");
    if (storedSlides) {
      setSlides(JSON.parse(storedSlides));
    }
  }, []);

  useEffect(() => {
    listenToData((newSlides) => {
      console.log(newSlides);
      setSlides(newSlides);
      localStorage.setItem("slides", JSON.stringify(newSlides));
    });
  }, []);

  useEffect(() => {
    appReady();
  }, []);

  useEffect(() => {
    console.log("reset");
    let intervalId = setInterval(() => nextSlide(), secondsPerSlide * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [slides]);

  const nextSlide = () =>
    setCurrentSlide((current) => (current + 1) % slides.length || 0);

  const slideCorrupted = (corruptedId: string) => {
    setSlides((current) => current.filter(({ id }) => id !== corruptedId));
  };

  const posts = slides.map((slide, index) => {
    const isCurrent = index === currentSlide;

    const overLimit =
      index - currentSlide > maxShownImages / 2 ||
      currentSlide - index > maxShownImages / 2;

    if (overLimit) {
      return null;
    }
    return (
      <div
        className={[
          "carousel__slide",
          (isCurrent && "carousel__slide--current") || "",
          (index < currentSlide &&
            `carousel__slide--before-${index - currentSlide}`) ||
            "",
          (index > currentSlide &&
            `carousel__slide--after-${currentSlide - index}`) ||
            "",
        ].join(" ")}
        key={slide.id}
      >
        <Post {...slide} slideCorrupted={slideCorrupted} />
      </div>
    );
  });

  return (
    <div className="instagram">
      <div className="carousel">
        <div className="carousel__slides">{posts}</div>
      </div>
    </div>
  );
};

export default Carousel;
