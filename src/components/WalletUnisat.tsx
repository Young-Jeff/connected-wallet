import { Button } from "@radix-ui/themes";
import { useState } from "react";
import AccountUnisat from "./AccountUnisat";
declare global {
  interface Window {
    unisat: any;
  }
}
export default function WalletOkx() {
  const [address, setAddress] = useState("");
  const connectHandle = async () => {
    const accounts = await window.unisat.requestAccounts();
    setAddress(accounts[0]);
  };

  return address ? (
    <AccountUnisat />
  ) : (
    <Button className="!cursor-pointer" onClick={() => connectHandle()}>
      连接unisat
    </Button>
  );
}
