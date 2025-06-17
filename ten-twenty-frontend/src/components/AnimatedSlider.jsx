// components/ImageSlider.jsx
import { useEffect, useRef, useState } from "react";
import bgImg from '../assets/bg-img.png'
// import "./slider.css"; // for custom keyframes

const images = [
 'https://cdn3.foxy.in/media/banner/image/3631/pride_sale__17_june.png?width=1024&format=webp',
 bgImg,
 'https://cdn3.foxy.in/media/banner/image/3627/tfs_flash_sale__2_.png?width=1024&format=webp',
 bgImg,
 'https://cdn3.foxy.in/media/banner/image/3627/tfs_flash_sale__2_.png?width=1024&format=webp',
 bgImg,
];

export default function AnimatedSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(images.length - 1);
  const timeoutRef = useRef(null);
  const isTransitioning = useRef(false);

  const delay = 3000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setPrev(current);
      setCurrent((p) => (p === images.length - 1 ? 0 : p + 1));
    }, delay);

    return () => resetTimeout();
  }, [current]);

  return (
    <div className="w-full overflow-hidden relative group">
      <div className="relative w-full h-[50vh]">
        {images.map((src, index) => {
          let imageClasses = `absolute top-0 left-0 w-full h-full object-cover transition-all duration-1500 ease-in-out`;

          if (index === current) {
            imageClasses += ` z-30`; // Current slide, expanded on top
          } else if (index === prev) {
            imageClasses += ` z-20`; // Previous slide, visible but below
          } else {
            imageClasses += ` z-10`; // Other slides, collapsed
          }

          return (
            <div 
              key={index}
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: index === current 
                  ? 'inset(0 0 0 0)' 
                  : index === prev 
                    ? 'inset(0 0 0 0)'
                    : 'inset(50% 0 50% 0)',
                transition: 'clip-path 1500ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <img
                src={src}
                alt={`slide-${index}`}
                className={imageClasses}
                style={{
                  transform: index === current 
                    ? 'scale(1.1)' 
                    : 'scale(1)',
                  transition: 'transform 1800ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => !isTransitioning.current && handleTransition(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
              current === index ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
