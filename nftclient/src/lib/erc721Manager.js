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
}
