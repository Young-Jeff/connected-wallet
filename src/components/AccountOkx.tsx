import { Dialog, Button, Flex } from "@radix-ui/themes";
import {
  CaretDownIcon,
  Cross2Icon,
  CopyIcon,
  ExitIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";

export default function Account() {
  const [address, setAddress] = useState();
  const [network, setNetwork] = useState();
  const [balance, setBalance] = useState<{
    confirmed: number;
    unconfirmed: number;
    total: number;
  }>();
  const toggleAccount = useCallback(async () => {
    const accounts = await window.okxwallet.bitcoin.requestAccounts();
    init();
  }, []);

  useEffect(() => {
    init();

    window.okxwallet.bitcoin.on("accountsChanged", (accounts: string) => {
      accounts && toggleAccount();
    });
  }, [toggleAccount]);
  const init = async () => {
    const _address = await window.okxwallet.bitcoin.getAccounts();
    const _network = await window.okxwallet.bitcoin.getNetwork();
    const _balance = await window.okxwallet.bitcoin.getBalance();
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
  return (
    <Flex gap="10px">
      {network && (
        <Button>
          {network}
          {/* <CaretDownIcon className="w-[20px] h-[20px]" /> */}
        </Button>
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
