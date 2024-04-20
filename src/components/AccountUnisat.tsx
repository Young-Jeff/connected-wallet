import { Dialog, Button, Flex, Box } from "@radix-ui/themes";
import {
  CaretDownIcon,
  Cross2Icon,
  CopyIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

type Network = "livenet" | "testnet";

export default function Account() {
  const [address, setAddress] = useState();
  const [network, setNetwork] = useState();
  const [balance, setBalance] = useState<{
    confirmed: number;
    unconfirmed: number;
    total: number;
  }>();
  const toggleAccount = useCallback(async () => {
    const accounts = await window.unisat.requestAccounts();
    accounts && init();
  }, []);
  const accountsChangedCb = useCallback(
    (accounts: string) => {
      accounts && toggleAccount();
    },
    [toggleAccount],
  );
  useEffect(() => {
    init();

    window.unisat.on("accountsChanged", accountsChangedCb);
    return () => {
      window.unisat.removeListener("networkChanged", accountsChangedCb);
    };
  }, [toggleAccount, accountsChangedCb]);
  const init = async () => {
    const _address = await window.unisat.getAccounts();
    const _network = await window.unisat.getNetwork();
    const _balance = await window.unisat.getBalance();
    setAddress(_address[0]);
    setNetwork(_network);
    setBalance(_balance);
  };
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
  const chainsClick = async (i: Network) => {
    await window.unisat.switchNetwork(i);
  };
  return (
    <Flex gap="10px">
      {network && (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>
              {network}
              <CaretDownIcon className="w-[20px] h-[20px]" />
            </Button>
          </Dialog.Trigger>
          <Dialog.Content maxWidth="320px">
            <Dialog.Close className="absolute top-[24px] right-[24px] hover:bg-[#eee] cursor-pointer rounded-full flex items-center justify-center">
              <Cross2Icon className="w-[20px] h-[20px]" />
            </Dialog.Close>
            <Flex direction="column" className="mt-[2rem]">
              {["livenet", "testnet"].map((i: any) => (
                <Flex
                  onClick={() => chainsClick(i)}
                  justify="between"
                  className={clsx(
                    "py-[0.5rem] px-[0.8rem] mb-1 last:mb-0  cursor-pointer rounded-[12px] font-bold",
                    { "bg-[#0e76fd] text-[#fff]": i === network },
                    {
                      "hover:bg-[#eee]": i !== network,
                    },
                  )}
                  key={i}
                >
                  <Box>{i}</Box>
                  <Box>{i === network && "已连接"}</Box>
                </Flex>
              ))}
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
      {balance && (
        <Button>
          <div className="max-w-[50px] line-clamp-1">{balance.total}</div>
          <div>&nbsp; BTC</div>
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
                {/* <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  // onClick={() => disconnectHandle()}
                  className="flex-1 px-[1rem] py-[0.5rem] hover:bg-[#eee] rounded-full cursor-pointer"
                >
                  <ExitIcon />
                  断开连接
                </Flex> */}
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Flex>
  );
}
