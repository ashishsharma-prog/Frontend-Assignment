import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";

const DELAY = 7000;
const LOADER_INTERVAL = 30;
const TRANSITION_DURATION = 1500;

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

const Slide = memo(({ profile, isCurrent, isPrev, isNext }) => {
  const clipPath = useMemo(() => 
    isCurrent || isPrev || isNext ? 'inset(0 0 0 0)' : 'inset(50% 0 50% 0)',
    [isCurrent, isPrev, isNext]
  );
  
  const transform = useMemo(() => 
    isCurrent ? 'scale(1.1)' : 'scale(1)',
    [isCurrent]
  );

  const zIndex = useMemo(() => 
    isCurrent ? 'z-30' : isPrev ? 'z-20' : 'z-10',
    [isCurrent, isPrev]
  );

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{
        clipPath,
        transition: 'clip-path 1500ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="relative w-full h-full">
        <img
          src={profile.image}
          alt={profile.name}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1500 ease-in-out ${zIndex}`}
          style={{
            transform,
            transition: 'transform 2000ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-4xl font-bold text-white mb-2">{profile.name}</h3>
          <p className="text-xl text-gray-200">{profile.location}</p>
        </div>
      </div>
    </div>
  );
});

Slide.displayName = 'Slide';

const NextPreview = memo(({ nextImage, loader, onNext }) => {
  const strokeDashoffset = useMemo(() => 
    768 - (768 * loader / 100),
    [loader]
  );

  return (
    <div
      className="relative w-48 h-48 rounded-md overflow-visible shadow-lg cursor-pointer group"
      onClick={onNext}
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
    >
      <svg width="192" height="192" className="absolute left-0 top-0 z-20 pointer-events-none" style={{overflow: 'visible'}}>
        <rect
          x="0" y="0" width="192" height="192"
          fill="none"
          stroke="#fff"
          strokeWidth="8"
          strokeDasharray={768}
          strokeDashoffset={strokeDashoffset}
          style={{transition: 'stroke-dashoffset 0.1s linear'}}
        />
      </svg>
      <div className="absolute left-0 top-0 w-full h-full rounded-md z-10 flex items-center justify-center">
        <div className="w-44 h-44 flex items-center justify-center">
          <img
            src={nextImage}
            alt="Next"
            className="w-32 h-32 object-cover rounded-md"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <span className="text-white text-sm font-normal">Next</span>
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
    <div className="flex items-center text-white text-lg font-normal tracking-widest mb-2">
      <span>{formattedCurrent}</span>
      <span className="mx-4 w-40 h-px bg-white/40" />
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
      <div className="relative w-full h-[70vh]">
        {slides}
      </div>

      <div className="absolute left-16 bottom-16 flex items-center z-40">
        <NextPreview
          nextImage={profiles[nextIndex].image}
          loader={loader}
          onNext={handleNext}
        />
        <div className="ml-8 min-w-[10rem] flex flex-col items-start justify-center">
          <SlideCounter current={current} total={profiles.length} />
        </div>
      </div>
    </div>
  );
};

export default memo(AnimatedSlider);
