import { Module } from '@nestjs/common';
import { AuctionBidController } from './auction-bid.controller';
import { AuctionBidService } from './auction-bid.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionBidSchema } from './schemas/auctionBid.schema';
import { AuctionItemModule } from '../auction-item/auction-item.module';
import { AuctionItemSchema } from '../auction-item/schemas/auctionItem.schema';

@Module({
  imports: [
    AuctionItemModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: 'AuctionBid', schema: AuctionBidSchema },
    ]),
  ],
  controllers: [AuctionBidController],
  providers: [AuctionBidService],
})
export class AuctionBidModule {}
