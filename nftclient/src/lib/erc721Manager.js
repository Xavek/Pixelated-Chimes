import { RpcProvider } from "starknet";

export class ERC721Manager {
  constructor(apiUrl, address) {
    this.apiUrl = apiUrl;
    this.address = address;
  }

  getProviderRPCInstance() {
    return new RpcProvider({ nodeUrl: this.apiUrl });
  }

  async getContractAbi() {
    const { abi } = await this.getProviderRPCInstance().getClassAt(
      this.address,
    );
    return abi;
  }

  async getERC20ContractAbi(contractAddress) {
    const { abi } =
      await this.getProviderRPCInstance().getClassAt(contractAddress);
    return abi;
  }

  async getERC20ContractWriteInstance(account, contractAddress) {
    const contractInstance = new Contract(
      this.getERC20ContractAbi(contractAddress),
      contractAddress,
      account,
    );
    contractInstance;
  }

  async getContractWriteInstance(account) {
    const contractInstance = new Contract(
      this.getContractAbi(),
      this.address,
      account,
    );
    return contractInstance;
  }

  async getContractReadInstance() {
    const abi = this.getContractAbi();
    const contractReadInstance = new Contract(
      abi,
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
    return (await contractReadInstance).call(functionName, contractCallData);
  }

  async invokeERC20ApproveFunction(account, contractAddress, contractCallData) {
    const erc20ContractWriteInstance = this.getERC20ContractWriteInstance(
      account,
      contractAddress,
    );
    return (await erc20ContractWriteInstance).invoke(
      "approve",
      contractCallData,
    );
  }
}
