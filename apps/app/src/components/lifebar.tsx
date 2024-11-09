import Image from "next/image";

import { Progress } from "./ui/progress";

export default function Lifebar({
  max,
  value,
}: {
  value: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[300px]">
        <div
          className="absolute h-9 min-w-[69px] rounded-l-3xl rounded-r-lg bg-[#314F90] p-[6px]"
          style={{
            left: 0,
            top: "-6px",
            zIndex: 1,
          }}
        >
          <div className="relative flex h-full items-center">
            <div>
              <Image
                alt="heart"
                width="20"
                height="20"
                src="/images/heart@3x.png"
              />
            </div>
            <div className="flex flex-1 flex-col gap-0">
              <span
                className="text-center text-xs font-bold leading-none text-white"
                style={{ textShadow: "1px 1px 2px #000000" }}
              >
                {value}
              </span>
              <span className="text-center text-[10px] font-bold text-[#0A132A]">
                /{max}
              </span>
            </div>
          </div>
        </div>
        <Progress className="h-6 w-80 shadow-lg" value={(value / max) * 100} />
      </div>
    </div>
  );
}
