"use client";

import Navigation from "@/components/Navigation";
import WalletOkx from "@/components/WalletOkx";
import WalletUnisat from "@/components/WalletUnisat";
import { Flex, Box } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Flex direction="column" align="center" className="py-[5rem]">
        <Box>
          <WalletOkx />{" "}
        </Box>
        <Box className="mt-[2rem]">
          <WalletUnisat />
        </Box>
      </Flex>
    </main>
  );
}
