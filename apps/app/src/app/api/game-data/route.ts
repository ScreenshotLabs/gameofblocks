import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    {
      monster: {
        id: Math.floor(Math.random() * 10) + 1,
        life: Math.floor(Math.random() * (2000 - 1000)) + 1000,
      },
    },
    { status: 200 },
  );
}
