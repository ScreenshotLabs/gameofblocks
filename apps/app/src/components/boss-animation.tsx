import Image from "next/image";

interface BossImageProps {
  isRotating: boolean;
  isAnimating: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const BossImage: React.FC<BossImageProps> = ({
  isRotating,
  isAnimating,
  width = 300,
  height = 300,
  className = "",
}) => {
  return (
    <div className={`absolute top-0 flex w-full justify-center ${className}`}>
      <div
        className={`relative ${isAnimating ? "pointer-events-none" : ""} ${
          isRotating ? "animate-wiggle" : ""
        }`}
      >
        {/* Base image with smooth fade */}
        <Image
          src="/images/boss.svg"
          alt="Boss"
          width={width}
          height={height}
          priority
        />
        {/* Attack image with smooth fade */}
        <Image
          src="/images/boss-hit.svg"
          alt="Boss Attack"
          width={width}
          height={height}
          priority
          className={`absolute left-0 top-0 transform-gpu transition-all duration-150 ease-in-out ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
};

export default BossImage;
