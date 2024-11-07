import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function GET(_req: NextRequest) {
  return NextResponse.json(
    {
      rankings: [
        {
          rank: 1,
          name: "Remi",
        },
        {
          rank: 2,
          name: "Kwiss",
        },
        {
          rank: 3,
          name: "Paul",
        },
      ],
    },
    { status: 200 },
  );
}
