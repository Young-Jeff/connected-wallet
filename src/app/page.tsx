"use client";

import Navigation from "@/components/Navigation";
import WalletOkx from "@/components/WalletOkx";
import WalletUnisat from "@/components/WalletUnisat";
import SignLogin from "@/components/SignLogin";
import { Flex, Box } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Flex direction="column" align="center" className="pt-[2rem]">
        <Box>
          <WalletOkx />{" "}
        </Box>
        <Box className="mt-[2rem]">
          <WalletUnisat />
        </Box>
      </Flex>
      <SignLogin />
    </main>
  );
}
