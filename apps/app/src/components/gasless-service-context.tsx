"use client";

import type { StarknetNetwork } from "@/types/starknet";
import type { ReactNode } from "react";
import React, { createContext } from "react";

import { GaslessService } from "../lib/gasless";
import { StarknetProvider } from "../lib/starknet";

export const GaslessServiceContext = createContext<GaslessService | null>(null);

export const GaslessServiceProvider = ({
  children,
  network,
}: {
  children: ReactNode;
  network: StarknetNetwork;
}) => {
  const gaslessService = new GaslessService(
    StarknetProvider.getInstance(),
    network,
  );

  return (
    <GaslessServiceContext.Provider value={gaslessService}>
      {children}
    </GaslessServiceContext.Provider>
  );
};
