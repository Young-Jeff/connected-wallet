import { verifyMessage } from "@wagmi/core";
import { config } from "@/app/providers";
//假设这是后台的数据库，users表里保存了user对象，user对象包含用户的地址和关联的nonce
//{"address": 用户地址, "nonce": 返回给前端的随机数nonce}
type Users = Record<string, any>;
export const users: Users = {};
/**
 * 通过地址获取后端生成的随机数 nonce，用于签名
 * @param address  用户地址
 * @returns {number} 返回随机数 nonce
 *
 * 这个方法充当后台服务，从后台中获取需要签名的数据
 */
export const auth = (address: string) => {
  let user = users[address];
  if (!user) {
    user = {
      address,
      nonce: Math.floor(Math.random() * 10000000),
    };
    users[address] = user;
  } else {
    const nonce = Math.floor(Math.random() * 10000000);
    user.nonce = nonce;
    users[address] = user;
  }
  return user.nonce;
};
/**
 * 验证用户签名是否正确
 * @param address   用户地址
 * @param signature 签名数据
 * @returns {boolean} 返回签名是否正确
 *
 * 这个方法充当后台服务，后台验证签名正确后，就返回相关登录态数据，完成登录流程
 */
export const verify = async (address: any, signature: any) => {
  console.log(`address: ${address}`);
  //从数据库中取出nonce
  let nonce = users[address].nonce;
  console.log(`nonce: ${nonce}`);
  //验证对nonce进行签名的地址
  const signValid = await verifyMessage(config, {
    address,
    message: nonce.toString(),
    signature: signature.toString(),
  });
  console.log(`decodedAddress: ${signValid}`);
  if (signValid) {
    // 出于安全原因，更改nonce，防止下次直接使用相同的nonce进行登录
    users[address].nonce = Math.floor(Math.random() * 10000000);
  }
  return signValid;
};
