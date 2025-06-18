import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import "../styles/sliderTextAnimation.css";
import Slider1 from '../assets/slider1.webp';
import Slider2 from '../assets/slider2.webp';
import Slider3 from '../assets/slider3.webp';
import Slider4 from '../assets/slider4.webp';

const DELAY = 7000;
const LOADER_INTERVAL = 30;
const TRANSITION_DURATION = 1500;

const profiles = [
  {
    id: 1,
    name: 'Client 1',
    location: 'Dubai, United Arab Emirates',
    image: Slider1,
  },
  {
    id: 2,
    name: 'Client 2',
    location: 'New York, United States',
    image: Slider2,
  },
  {
    id: 3,
    name: 'Client 3',
    location: 'London, United Kingdom',
    image: Slider3,
  },
  {
    id: 4,
    name: 'Client 4',
    location: 'Tokyo, Japan',
    image: Slider4,
  },
  {
    id: 5,
    name: 'Client 5',
    location: 'Sydney, Australia',
    image: Slider1,
  },
  {
    id: 6,
    name: 'Client 6',
    location: 'Paris, France',
    image: Slider2,
  },
];

const styles = {
  slide: {
    clipPath: 'inset(0 0 0 0)',
    transition: 'clip-path 1500ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  slideHidden: {
    clipPath: 'inset(50% 0 50% 0)',
    transition: 'clip-path 1500ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  image: {
    transform: 'scale(1)',
    transition: 'transform 2000ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  imageActive: {
    transform: 'scale(1.1)',
    transition: 'transform 2000ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  nextPreview: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
  },
  welcomeText: {
    textShadow: '0 2px 8px rgba(0,0,0,0.4)'
  },
  headingText: {
    textShadow: '0 4px 16px rgba(0,0,0,0.5)'
  }
};

const Slide = memo(({ profile, isCurrent, isPrev, isNext }) => {
  const slideStyle = useMemo(() => 
    isCurrent || isPrev || isNext ? styles.slide : styles.slideHidden,
    [isCurrent, isPrev, isNext]
  );
  
  const imageStyle = useMemo(() => 
    isCurrent ? styles.imageActive : styles.image,
    [isCurrent]
  );

  const zIndex = useMemo(() => 
    isCurrent ? 'z-30' : isPrev ? 'z-20' : 'z-10',
    [isCurrent, isPrev]
  );

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={slideStyle}
    >
      <div className="relative w-full h-full">
        <img
          src={profile.image}
          alt={profile.name}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1500 ease-in-out ${zIndex}`}
          style={imageStyle}
         
        />
      </div>
    </div>
  );
});

Slide.displayName = 'Slide';

const NextPreview = memo(({ nextImage, loader, onNext }) => {
  const svgProps = useMemo(() => {
    if (window.innerWidth >= 1024) return { size: 128, dash: 512, stroke: 6 };
    if (window.innerWidth >= 640) return { size: 96, dash: 384, stroke: 5 };
    if (window.innerWidth >= 475) return { size: 80, dash: 320, stroke: 4 };
    return { size: 64, dash: 256, stroke: 3 };
  }, []);

  const { size, dash, stroke } = svgProps;
  const strokeDashoffset = useMemo(() => 
    dash - (dash * loader / 100),
    [dash, loader]
  );

  return (
    <div
      className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-md overflow-visible shadow-lg cursor-pointer group"
      onClick={onNext}
      style={styles.nextPreview}
    >
      <svg
        width={size}
        height={size}
        className="absolute left-0 top-0 z-20 pointer-events-none"
        style={{overflow: 'visible'}}
      >
        <rect
          x="0" y="0" width={size} height={size}
          fill="none"
          stroke="#fff"
          strokeWidth={stroke}
          strokeDasharray={dash}
          strokeDashoffset={strokeDashoffset}
          style={{transition: 'stroke-dashoffset 0.1s linear'}}
        />
      </svg>
      <div className="absolute left-0 top-0 w-full h-full rounded-md z-10 flex items-center justify-center">
        <div className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center">
          <img
            src={nextImage}
            alt="Next"
            className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded-md"
           g
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <span className="text-white text-[10px] xs:text-xs font-normal">Next</span>
          </div>
        </div>
      </div>
    </div>
  );
});

NextPreview.displayName = 'NextPreview';

const SlideCounter = memo(({ current, total }) => {
  const formattedCurrent = useMemo(() => 
    String(current + 1).padStart(2, '0'),
    [current]
  );
  
  const formattedTotal = useMemo(() => 
    String(total).padStart(2, '0'),
    [total]
  );

  return (
    <div className="flex items-center text-white text-xs xs:text-sm sm:text-base md:text-lg font-normal tracking-widest mb-1 sm:mb-2">
      <span>{formattedCurrent}</span>
      <span className="mx-2 xs:mx-3 sm:mx-4 w-12 xs:w-20 sm:w-32 md:w-40 h-px bg-white/40" />
      <span>{formattedTotal}</span>
    </div>
  );
});

SlideCounter.displayName = 'SlideCounter';

const AnimatedSlider = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(profiles.length - 1);
  const [loader, setLoader] = useState(0);
  const timeoutRef = useRef(null);
  const loaderRef = useRef(null);
  const isTransitioning = useRef(false);
  const progressRef = useRef(0);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resetLoader = useCallback(() => {
    if (loaderRef.current) {
      clearInterval(loaderRef.current);
      loaderRef.current = null;
    }
  }, []);

  const nextIndex = useMemo(() => 
    current === profiles.length - 1 ? 0 : current + 1,
    [current]
  );

  const handleNext = useCallback(() => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    setPrev(current);
    setCurrent(nextIndex);
    
    const timer = setTimeout(() => {
      isTransitioning.current = false;
    }, TRANSITION_DURATION);
    
    return () => clearTimeout(timer);
  }, [current, nextIndex]);

  useEffect(() => {
    setLoader(0);
    progressRef.current = 0;
    resetLoader();

    const updateLoader = () => {
      progressRef.current += (LOADER_INTERVAL / DELAY) * 100;
      setLoader(Math.min(progressRef.current, 100));
    };

    loaderRef.current = setInterval(updateLoader, LOADER_INTERVAL);

    return () => {
      resetLoader();
      progressRef.current = 0;
    };
  }, [current, resetLoader]);

  useEffect(() => {
    resetTimeout();
    
    timeoutRef.current = setTimeout(() => {
      if (!isTransitioning.current) {
        setPrev(current);
        setCurrent((p) => (p === profiles.length - 1 ? 0 : p + 1));
      }
    }, DELAY);

    return () => resetTimeout();
  }, [current, resetTimeout]);

  const slides = useMemo(() => 
    profiles.map((profile, index) => (
      <Slide
        key={profile.id}
        profile={profile}
        isCurrent={index === current}
        isPrev={index === prev}
        isNext={(current === profiles.length - 1 && index === 0) || 
                (current !== profiles.length - 1 && index === current + 1)}
      />
    )),
    [current, prev]
  );

  return (
    <div className="w-full overflow-hidden relative group">
      <div
        key={current}
        className="absolute inset-0 z-50 flex flex-col items-start justify-center pointer-events-none select-none pl-2 sm:pl-4 md:pl-8 lg:pl-24 text-left w-full mt-12 sm:mt-20 md:mt-24"
      >
        <span className="text-white text-sm xs:text-base sm:text-lg md:text-xl font-light mb-1 sm:mb-2 md:mb-4 opacity-80 tracking-wide animate-slideUpFade" style={styles.welcomeText}>Welcome To TenTwenty Farms</span>
        <h1 className="text-white text-lg xs:text-xl sm:text-3xl md:text-6xl font-light leading-tight md:leading-tight animate-slideUpFade-delay" style={styles.headingText}>From Our Farms<br className='hidden sm:block'/>To Your Hands</h1>
      </div>

      <div className="relative w-full h-[50vh] sm:h-[65vh] md:h-[85vh]">
        {slides}
      </div>
      <div className="absolute left-1 xs:left-2 sm:left-8 md:left-24 bottom-2 xs:bottom-4 sm:bottom-8 md:bottom-16 flex flex-row items-end sm:items-center z-40 w-full pr-2 sm:pr-0 gap-2 sm:gap-8">
        <div className="flex-1 flex flex-col items-end justify-end text-right sm:items-start sm:justify-center sm:text-left ml-2 sm:ml-0 sm:mr-8 mt-0 min-w-[7rem] sm:min-w-[10rem] order-2 sm:order-1">
          <SlideCounter current={current} total={profiles.length} />
        </div>
        <NextPreview
          nextImage={profiles[nextIndex].image}
          loader={loader}
          onNext={handleNext}
          className="order-1 sm:order-2"
        />
      </div>
    </div>
  );
};

export default memo(AnimatedSlider);
