import Image from "next/image";

export default function GameHeader() {
  return (
    <div className="relative">
      <Image
        className="absolute left-0 top-0"
        src="/images/corner-left@3x.png"
        alt="Left corner"
        width={74}
        height={86}
        quality={100}
      />
      <div
        className="absolute h-[86px] w-full bg-repeat-x"
        style={{
          backgroundImage: "url('/images/middle@3x.png')",
          backgroundSize: "131px 86px",
        }}
      ></div>
      <Image
        className="absolute right-0 top-0"
        src="/images/corner-right@3x.png"
        alt="Right corner"
        width={74}
        height={86}
        quality={100}
      />
    </div>
  );
}
