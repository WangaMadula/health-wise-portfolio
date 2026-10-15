import React, { useEffect } from 'react';

const ScrollAnimation = () => {
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('.service-card');
      const servicesSection = document.querySelector('.services-section');
      
      if (servicesSection) {
        const sectionRect = servicesSection.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - sectionRect.top) / (window.innerHeight + sectionRect.height);
        
        // Apply parallax effect to background
        if (scrollProgress > 0 && scrollProgress < 1) {
          servicesSection.style.backgroundPositionY = `${scrollProgress * 50}%`;
        }

        // Animate cards when they come into view
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight - 100;
          
          if (isVisible) {
            card.classList.add('visible');
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
};

export default ScrollAnimation;