import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
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
    console.log("accounts:", accounts);
    setAddress(accounts[0]);
  };
  useEffect(() => {
    if (typeof window.unisat !== "undefined") {
      console.log("UniSat Wallet is installed!");
    }
  }, []);

  return address ? (
    <AccountUnisat />
  ) : (
    <Button className="!cursor-pointer" onClick={() => connectHandle()}>
      连接unisat
    </Button>
  );
}
