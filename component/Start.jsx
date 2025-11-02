
import React, { useState } from 'react';
import { FaStar } from "react-icons/fa6";

const Star = ({ starValue = 5, onRate }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[...Array(starValue)].map((_, index) => {
        const currentStar = index + 1; 
        const isFilled = currentStar <= (hover || rating);

        return (
          <span
            key={currentStar}
            onClick={() => {
              setRating(currentStar);
              onRate && onRate(currentStar);
            }}
            onMouseEnter={() => setHover(currentStar)}
            onMouseLeave={() => setHover(rating)}
          >
            <FaStar
              className={`text-2xl cursor-pointer ${isFilled ? "text-[#e24e4e]" : "text-black"}`}
            />
          </span>
        );
      })}
    </div>
  );
};

export default Star;
