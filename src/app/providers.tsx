"use client";
import React from "react";
import { http, createConfig } from "wagmi";
import { mainnet, sepolia, optimism } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, safe } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia, optimism],
  connectors: [injected(), safe()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
