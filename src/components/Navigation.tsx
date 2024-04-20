"use client";
import { Flex, Box } from "@radix-ui/themes";
import Wallet from "./Wallet";

import { useAccount } from "wagmi";
import Account from "./Account";
export default function Navigation() {
  const { isConnected } = useAccount();
  return (
    <Flex justify="between" px="300px" py="10px">
      <Box>logo</Box>

      {isConnected ? <Account /> : <Wallet />}
    </Flex>
  );
}
