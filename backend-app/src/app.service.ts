import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  provider: ethers.Provider;
  wallet: ethers.Wallet;
  contract: ethers.Contract;
}

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_ENDPOINT_URL ?? '',
    );
    this.wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY ?? '',
      this.provider;
    )
    this.contract = new ethers.Contract(
      TOKEN_ADDRESS,
      tokenJson.abi,
      this.wallet,
    );
  }

getTokenAddress(): any {
  return { address: TOKEN_ADDRESS};
}

getTotalSupply(): Promise<bigint> {
  return this.contract.balanceOf(address);
}

mintTokens(address: string): any {
  return {success: true, txHash: '...'};
}
}
