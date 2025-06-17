// components/ImageSlider.jsx
import { useEffect, useRef, useState } from "react";
import bgImg from '../assets/bg-img.png'
// import "./slider.css"; // for custom keyframes

const profiles = [
  {
    id: 1,
    name: 'Client 1',
    location: 'Dubai, United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&q=80',
  },
  {
    id: 2,
    name: 'Client 2',
    location: 'New York, United States',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&q=80',
  },
  {
    id: 3,
    name: 'Client 3',
    location: 'London, United Kingdom',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1024&q=80',
  },
  {
    id: 4,
    name: 'Client 4',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&q=80',
  },
  {
    id: 5,
    name: 'Client 5',
    location: 'Sydney, Australia',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1024&q=80',
  },
  {
    id: 6,
    name: 'Client 6',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1024&q=80',
  },
];

export default function AnimatedSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(profiles.length - 1);
  const timeoutRef = useRef(null);
  const isTransitioning = useRef(false);

  const delay = 3000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTransition = (index) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setPrev(current);
    setCurrent(index);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1500);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setPrev(current);
      setCurrent((p) => (p === profiles.length - 1 ? 0 : p + 1));
    }, delay);

    return () => resetTimeout();
  }, [current]);

  return (
    <div className="w-full overflow-hidden relative group">
      <div className="relative w-full h-[70vh]">
        {profiles.map((profile, index) => {
          let imageClasses = `absolute top-0 left-0 w-full h-full object-cover transition-all duration-1500 ease-in-out`;

          if (index === current) {
            imageClasses += ` z-30`; // Current slide, expanded on top
          } else if (index === prev) {
            imageClasses += ` z-20`; // Previous slide, visible but below
          } else {
            imageClasses += ` z-10`; // Other slides, collapsed
          }

          const isCurrent = index === current;
          const isPrev = index === prev;
          const isNext = (current === profiles.length - 1 && index === 0) || (current !== profiles.length - 1 && index === current + 1);

          return (
            <div 
              key={profile.id}
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: isCurrent || isPrev || isNext
                  ? 'inset(0 0 0 0)' 
                  : 'inset(50% 0 50% 0)',
                transition: 'clip-path 1500ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="relative w-full h-full">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className={imageClasses}
                  style={{
                    transform: isCurrent 
                      ? 'scale(1.1)' 
                      : 'scale(1)',
                    transition: 'transform 2000ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                {/* Overlay with profile info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-4xl font-bold text-white mb-2">{profile.name}</h3>
                  <p className="text-xl text-gray-200">{profile.location}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {profiles.map((_, index) => (
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
