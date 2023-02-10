import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuctionBidService } from './auction-bid.service';
import { isValidId } from '../pipes/isValidId.pipe';
import { AuctionBid } from './schemas/auctionBid.schema';
import { User } from '../decorators/user.decorator';
import { CreateBidDto } from './dto/create-bid.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auction-bid')
export class AuctionBidController {
  constructor(private auctionBidService: AuctionBidService) {}

  @Post('/:id')
  @UseGuards(AuthGuard())
  async createAuctionBid(
    @Param('id', isValidId)
    id: string,
    @Body()
    auctionBid: CreateBidDto,
    @User() user,
  ): Promise<AuctionBid> {
    return this.auctionBidService.create(id, auctionBid, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  async getAuctionBid(
    @Param('id', isValidId)
    id: string,
    @User() user,
  ): Promise<AuctionBid> {
    return this.auctionBidService.findById(id);
  }
}
