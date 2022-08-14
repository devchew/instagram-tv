import React, { FunctionComponent, useEffect, useState } from 'react';
import Post, { PostProps } from './Post';
import settings from './../settings.json';
import { fetchImages } from '../api/fetchImages';


const Carousel: FunctionComponent = () => {
    const {maxShownImages, secondsPerSlide} = settings;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<PostProps[]>([]);

    useEffect(() => {
        fetchImages.then(setSlides)
    }, [])

    useEffect(() => {
        const id = setInterval(nextSlide, secondsPerSlide * 1000)
        return () => clearInterval(id)
    }, [])

    const nextSlide = () => setCurrentSlide((current) => current > slides.length ? 0 : current + 1)

    const posts = slides.map((slide, index) => {
        const isCurrent = index === currentSlide;

        const overLimit =
            (index - currentSlide) > maxShownImages / 2 ||
            (currentSlide - index) > maxShownImages / 2;

        if (overLimit) {
            return null;
        }
        return (
            <div
                className={[
                    'carousel__slide',
                    isCurrent && 'carousel__slide--current',
                    index < currentSlide && `carousel__slide--before-${index - currentSlide}`,
                    index > currentSlide && `carousel__slide--after-${currentSlide - index}`
                ].join(' ')}
                key={slide.id}
            >
                <Post {...slide} />
            </div>
        );
    });

    return (
        <div className="instagram">
            <div className="carousel">
                <div className="carousel__slides">
                    {posts}
                </div>
            </div>
        </div>
    );
};

export default Carousel;
