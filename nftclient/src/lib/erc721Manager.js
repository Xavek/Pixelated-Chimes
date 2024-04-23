import { RpcProvider, Contract } from "starknet";
import { DEPLOYED_CONTRACT_ADDRESS, NODE_URL_API } from "./utils";

class ERC721Manager {
  constructor(apiUrl, address) {
    this.apiUrl = apiUrl;
    this.address = address;
  }

  getProviderRPCInstance() {
    return new RpcProvider({ nodeUrl: this.apiUrl });
  }

  async getContractAbi() {
    const abi = await this.getProviderRPCInstance().getClassAt(this.address);
    if (abi === undefined) {
      throw new Error("no abi");
    }

    return abi.abi;
  }

  async getERC20ContractAbi(contractAddress) {
    const { abi } =
      await this.getProviderRPCInstance().getClassAt(contractAddress);
    return abi;
  }

  async getERC20ContractWriteInstance(account, contractAddress) {
    const contractInstance = new Contract(
      await this.getERC20ContractAbi(contractAddress),
      contractAddress,
      this.getProviderRPCInstance(),
    );
    contractInstance.connect(account);
    return contractInstance;
  }

  async getContractWriteInstance(account) {
    const contractInstance = new Contract(
      await this.getContractAbi(),
      this.address,
      this.getProviderRPCInstance(),
    );
    contractInstance.connect(account);
    return contractInstance;
  }

  async getContractReadInstance() {
    const contractReadInstance = new Contract(
      await this.getContractAbi(),
      this.address,
      this.getProviderRPCInstance(),
    );
    return contractReadInstance;
  }
  async invokeContractFunction(account, functionName, contractCallData) {
    const contractWriteInstance = this.getContractWriteInstance(account);
    return (await contractWriteInstance).invoke(functionName, contractCallData);
  }

  async readContractFunction(functionName, contractCallData) {
    const contractReadInstance = this.getContractReadInstance();
    return (await contractReadInstance).call(functionName, contractCallData, {
      parseResponse: true,
    });
  }

  async invokeERC20ApproveFunction(account, contractAddress, contractCallData) {
    const erc20ContractWriteInstance = this.getERC20ContractWriteInstance(
      account,
      contractAddress,
    );
    const response =  (await erc20ContractWriteInstance).invoke(
      "approve",
      contractCallData,
    );
    await this.getProviderRPCInstance().waitForTransaction((await response).transaction_hash)
    return (await response).transaction_hash
  }
}

export const erc721ManagerInstance = new ERC721Manager(
  NODE_URL_API,
  DEPLOYED_CONTRACT_ADDRESS,
);
