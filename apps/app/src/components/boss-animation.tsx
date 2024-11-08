import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BossImageProps {
  isAttacking: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const BossImage: React.FC<BossImageProps> = ({ 
  isAttacking, 
  width = 300, 
  height = 300,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAttacking && isAnimating === false) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }
  }, [isAttacking, isAnimating]);

  return (
    <div className={`absolute top-0 w-full flex justify-center ${className}`}>
      <div 
        className={`transition-transform duration-50 ${
          isAnimating 
            ? '-rotate-3 transform' 
            :  'rotate-0 transform'
        }`}
      >
        <Image
          src={isAnimating ? '/images/boss-hit.svg' : '/images/boss.svg'}
          alt="Boss"
          width={width}
          height={height}
          className="transition-opacity duration-50"
          priority
        />
      </div>
    </div>
  );
};

export default BossImage;