import Image from "next/image";

export default function GameFooter() {
  return (
    <div className="absolute bottom-0 left-0 z-20 w-full">
      <Image width="133" height="133" alt="peasant" src="/images/peasant.png" />
    </div>
  );
}
