import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokensDto } from './assets/dtos/mintToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-address')
  getAddress(): any {
    return this.appService.getTokenAddress();
  }

  @Get('get-total-supply')
  getTotalSupply(): Promise<bigint> {
    
  }
  
  @Get('get-token-balance/:address')
  getTokenBalance(@Param('address') address: string): Promise<bigint> {
    return this.appService.getTokenBalance(address);
  }

  @Post('mint-tokens')
  mintTokens(@Body: MintTokensDto): Promise<any> {
    return this.appService.mintTokens('');
  }
}
