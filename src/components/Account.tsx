import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useChains,
  useBalance,
} from "wagmi";
import { switchChain } from "@wagmi/core";
import Image from "next/image";
import { Dialog, Button, Flex, Box } from "@radix-ui/themes";
import {
  CaretDownIcon,
  Cross2Icon,
  CopyIcon,
  ExitIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { formatEther } from "viem";
import _ from "lodash";
import { config } from "@/app/providers";

export default function Account() {
  const { address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const balance = useBalance({
    address: address,
  });
  const chains = useChains();
  const [copy, setCopy] = useState(false);
  const copyHandle = () => {
    !copy &&
      address &&
      navigator.clipboard
        .writeText(address)
        .then(() => {
          setCopy(true);
          setTimeout(() => {
            setCopy(false);
          }, 2000);
        })
        .catch((err) => {
          console.error("复制失败: ", err);
        });
  };
  const { balanceVal, symbol } = useMemo(() => {
    const value = _.get(balance, ["data", "value"], 0);
    const symbol = _.get(balance, ["data", "symbol"]);
    const balanceVal = formatEther(value);
    return {
      balanceVal,
      symbol,
    };
  }, [balance]);

  const disconnectHandle = () => {
    disconnect();
  };
  const chainsClick = (i: any) => {
    switchChain(config, { chainId: i.id });
  };
  return (
    <Flex gap="10px">
      {ensAvatar && <Image alt="ENS Avatar" src={ensAvatar} />}
      {chain && (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>
              {chain.name}
              <CaretDownIcon className="w-[20px] h-[20px]" />
            </Button>
          </Dialog.Trigger>
          <Dialog.Content maxWidth="320px">
            <Dialog.Close className="absolute top-[24px] right-[24px] hover:bg-[#eee] cursor-pointer rounded-full flex items-center justify-center">
              <Cross2Icon className="w-[20px] h-[20px]" />
            </Dialog.Close>
            <Flex direction="column" className="mt-[2rem]">
              {chains.map((i) => (
                <Flex
                  onClick={() => chainsClick(i)}
                  justify="between"
                  className={clsx(
                    "py-[0.5rem] px-[0.8rem] mb-1 last:mb-0 cursor-pointer rounded-[12px] font-bold",
                    { "bg-[#0e76fd] text-[#fff]": i.id === chain.id },
                    {
                      "hover:bg-[#eee]": i.id !== chain.id,
                    },
                  )}
                  key={i.id}
                >
                  <Box>{i.name}</Box>
                  <Box>{i.id === chain.id && "已连接"}</Box>
                </Flex>
              ))}
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
      {balanceVal && symbol && (
        <Button>
          <div className="max-w-[50px] line-clamp-1">{balanceVal}</div>
          <div>
            &nbsp;
            {symbol}
          </div>
        </Button>
      )}
      {address && (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>
              <div className="w-[100px] line-clamp-1">{address}</div>
              <CaretDownIcon className="w-[20px] h-[20px]" />
            </Button>
          </Dialog.Trigger>
          <Dialog.Content maxWidth="320px">
            <Dialog.Close className="absolute top-[24px] right-[24px] hover:bg-[#eee] cursor-pointer rounded-full flex items-center justify-center">
              <Cross2Icon className="w-[20px] h-[20px]" />
            </Dialog.Close>
            <Flex direction="column" align="center" className="mt-[2rem]">
              <div className="w-[100px] line-clamp-1">{address}</div>
              <Flex justify="between" className="w-full mt-[2rem]">
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  onClick={() => copyHandle()}
                  className="flex-1 px-[1rem] py-[0.5rem] hover:bg-[#eee] rounded-full cursor-pointer"
                >
                  {copy ? <CheckIcon /> : <CopyIcon />}
                  {copy ? "已复制!" : "复制地址"}
                </Flex>
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  onClick={() => disconnectHandle()}
                  className="flex-1 px-[1rem] py-[0.5rem] hover:bg-[#eee] rounded-full cursor-pointer"
                >
                  <ExitIcon />
                  断开连接
                </Flex>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Flex>
  );
}
