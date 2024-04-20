import { useConnect } from "wagmi";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
export default function Wallet() {
  const { connectors, connect } = useConnect();
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button className="!cursor-pointer">连接钱包</Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="320px">
        <Dialog.Title>连接钱包</Dialog.Title>
        <Dialog.Close className="absolute top-[24px] right-[24px] hover:bg-[#eee] cursor-pointer rounded-full flex items-center justify-center">
          <Cross2Icon className="w-[20px] h-[20px]" />
        </Dialog.Close>
        <Flex direction="column" gap="3">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              color="gray"
              variant="surface"
              className="!cursor-pointer hover:bg-[#eee]"
            >
              {connector.name}
            </Button>
          ))}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
