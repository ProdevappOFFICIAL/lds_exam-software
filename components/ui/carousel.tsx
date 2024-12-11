import { useState, useEffect } from "react";
import SlideOne from "../slides/slide_1";
import SlideTwo from "../slides/slide_2";
import { ArrowLeft, ArrowRight } from "lucide-react";
import './scroll.css'
/*import SlideThree from "./slides/slide3";
import SlideFour from "./slides/slide4";
import SlideFive from "./slides/slide5";*/

const Carousel = () => {
  // Array of components to display in the carousel
 // const slides = [<SlideOne />, <SlideTwo />, <SlideThree/>, <SlideFour/>, <SlideFive/>];
 const slides = [<SlideOne />, <SlideTwo />];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  // Automatically change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full mx-auto rounded-md ">
      
      <div className="custom-scrollbar overflow-y-auto  relative">
        <div
          className="flex h-full transition-all duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="flex-shrink-0 w-full">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Prev and Next buttons */}
     
    </div>
  );
};

export default Carousel;
