import { useConnect, useAccountEffect } from "wagmi";
import { Button, Flex, Box } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { auth, verify } from "@/utils/index";
import { signMessage } from "@wagmi/core";
import { config } from "@/app/providers";
export default function SignLogin() {
  const { connectors, connect } = useConnect();
  const [address, setAddress] = useState<any>("");
  const [nonce, setNonce] = useState("");
  const [signature, setSignature] = useState("");
  const [signStatus, setSignStatus] = useState(false);
  useAccountEffect({
    onConnect(data) {
      setAddress(data.address);
    },
    onDisconnect() {
      setAddress("");
    },
  });

  const connectHandle = async () => {
    const metamask = connectors.find(
      (connector) => connector.id === "io.metamask",
    );
    metamask &&
      (await connect({
        connector: metamask,
      }));
  };
  const signHandle = async () => {
    const signature = await signMessage(config, {
      account: address,
      message: nonce.toString(),
    });
    setSignature(signature);
    const signStatus = await verify(address, signature);

    setSignStatus(signStatus);
  };
  useEffect(() => {
    if (address) {
      const nonce = auth(address);
      setNonce(nonce);
    }
  }, [address]);
  return (
    <Flex
      direction="column"
      align="center"
      className="mt-[2rem] py-[2rem] w-[600px] mx-auto border-[2px] border-[#f00] border-dashed rounded-[1rem]"
    >
      <h2 className="text-[1.5rem] font-bold">钱包签名登陆</h2>

      {address ? (
        <Flex direction="column" className=" overflow-hidden px-[1rem] w-full">
          <Box>钱包地址：{address}</Box>
          <Box>Nonce: {nonce}</Box>
          <Box className="max-w-full overflow-hidden line-clamp-1">
            Signature: {signature}
          </Box>
          <Box>是否签名成功:{signStatus ? "是" : "否"}</Box>
          <Button onClick={() => signHandle()} className="!w-[100px] !mx-auto">
            签名
          </Button>
        </Flex>
      ) : (
        <Button onClick={() => connectHandle()} className="!cursor-pointer">
          连接MetaMask
        </Button>
      )}
    </Flex>
  );
}
