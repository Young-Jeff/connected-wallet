import { Button } from "@radix-ui/themes";
import { useState } from "react";
import AccountOkx from "./AccountOkx";
declare global {
  interface Window {
    okxwallet: any;
  }
}
export default function WalletOkx() {
  const [address, setAddress] = useState("");
  const connectHandle = async () => {
    const { address } = await window.okxwallet.bitcoin.connect();
    setAddress(address);
  };

  return address ? (
    <AccountOkx />
  ) : (
    <Button className="!cursor-pointer" onClick={() => connectHandle()}>
      连接okx
    </Button>
  );
}
