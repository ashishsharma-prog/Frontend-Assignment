import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/cardTextAnimation.css';

// Styles
const styles = {
  container: 'flex flex-col items-center justify-center min-h-screen bg-white p-4 overflow-hidden',
  header: 'mb-12 md:mb-24 mt-8 md:mt-16 text-center max-w-3xl mx-auto px-4',
  headerTitle: 'text-2xl md:text-4xl font-bold text-gray-900 mb-4',
  headerText: 'text-gray-600 text-base md:text-lg leading-relaxed',
  sliderContainer: 'relative w-full max-w-6xl h-[350px] md:h-[800px] mb-12 md:mb-24 flex items-center justify-center',
  slider: 'relative w-full h-full cursor-grab active:cursor-grabbing touch-none',
  card: 'absolute left-1/2 top-1/2 w-[160px] md:w-[500px] h-[260px] md:h-[800px] bg-white rounded-sm shadow-2xl overflow-hidden select-none',
  cardImage: 'w-full h-4/5 object-cover pointer-events-none',
  dragIndicator: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 font-medium text-xs md:text-base',
  profileInfo: 'absolute bottom-0 left-0 right-0 p-2 md:p-8 bg-gradient-to-t from-black/80 to-transparent',
  profileName: 'text-base md:text-3xl font-bold mb-1 md:mb-3 text-white text-center',
  profileLocation: 'text-xs md:text-xl text-gray-200 text-center',
  navButton: 'absolute top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 backdrop-blur-sm z-20',
  navButtonLeft: 'left-2 md:left-4',
  navButtonRight: 'right-2 md:right-4',
  helpText: 'text-center text-gray-300 text-xs md:text-sm',
};

// Mock data
const profiles = [
  {
    id: 1,
    name: 'Client 1',
    location: 'Dubai, United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=800&fit=crop',
  },
  {
    id: 2,
    name: 'Client 2',
    location: 'New York, United States',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop',
  },
  {
    id: 3,
    name: 'Client 3',
    location: 'London, United Kingdom',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=800&fit=crop',
  },
  {
    id: 4,
    name: 'Client 4',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop',
  },
  {
    id: 5,
    name: 'Client 5',
    location: 'Sydney, Australia',
    image: 'https://images.unsplash.com/photo-1574483345307-2c91043e7a8c?w=600&h=800&fit=crop',
  },
  {
    id: 6,
    name: 'Client 6',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600&h=800&fit=crop',
  },
];

const HorizontalCardSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (isAnimating) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isAnimating]);

  const handleTouchStart = useCallback((e) => {
    if (isAnimating) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, [isAnimating]);

  const goToNext = useCallback(() => {
    if (isAnimating || currentIndex >= profiles.length - 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
    setDragOffset(0);
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating, currentIndex]);

  const goToPrevious = useCallback(() => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
    setDragOffset(0);
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating, currentIndex]);

  const handleRelease = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentIndex > 0) {
        goToPrevious();
      } else if (dragOffset < 0 && currentIndex < profiles.length - 1) {
        goToNext();
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
  }, [isDragging, dragOffset, currentIndex, goToNext, goToPrevious]);

  const getCardStyle = useCallback((index) => {
    const relativeIndex = index - currentIndex;
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 160 : 500;
    const cardSpacing = isMobile ? 180 : 800; // Reduced spacing for mobile
    const baseTranslateX = relativeIndex * cardSpacing + dragOffset;
    const scale = relativeIndex === 0 ? 1 : 0.85;
    const opacity = Math.abs(relativeIndex) <= 1 ? 1 : 0;
    const zIndex = 10 - Math.abs(relativeIndex);
    
    let rotation = 0;
    let translateY = 0;
    if (relativeIndex < 0) {
      rotation = -15;
      translateY = isMobile ? 30 : 130;
    }
    if (relativeIndex >= 1) {
      rotation = 15;
      translateY = isMobile ? 30 : 130;
    }

    return {
      transform: `translateX(${baseTranslateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
      opacity,
      zIndex,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
      visibility: Math.abs(relativeIndex) <= 1 ? 'visible' : 'hidden',
      marginLeft: isMobile ? '-80px' : '-250px',
      marginTop: isMobile ? '-130px' : '-400px',
    };
  }, [currentIndex, dragOffset, isDragging]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStart.x;
      setDragOffset(deltaX);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - dragStart.x;
      setDragOffset(deltaX);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleRelease);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleRelease);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleRelease);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleRelease);
    };
  }, [isDragging, dragStart, handleRelease]);

  const renderCard = useCallback((profile, index) => (
    <div
      key={profile.id}
      className={styles.card}
      style={getCardStyle(index)}
    >
      <div className="relative h-full">
        <img src={profile.image} alt={profile.name} className={styles.cardImage} />
        {index === currentIndex && (
          <div className={styles.dragIndicator}>Drag</div>
        )}
        {index === currentIndex && (
          <div className={styles.profileInfo}>
            <h3 className={`${styles.profileName} animate-slideUpFade`}>{profile.name}</h3>
            <p className={`${styles.profileLocation} animate-slideUpFade-delay`}>{profile.location}</p>
          </div>
        )}
      </div>
    </div>
  ), [currentIndex, getCardStyle]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.headerTitle} animate-slideUpFade`}>Quality Products</h1>
        <p className={`${styles.headerText} animate-slideUpFade-delay`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>

      <div className={styles.sliderContainer}>
        <div
          ref={sliderRef}
          className={styles.slider}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {profiles.map((profile, index) => renderCard(profile, index))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCardSlider;
