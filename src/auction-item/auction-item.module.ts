import { Module } from '@nestjs/common';
import { AuctionItemController } from './auction-item.controller';
import { AuctionItemService } from './auction-item.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionItemSchema } from './schemas/auctionItem.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'AuctionItem', schema: AuctionItemSchema },
    ]),
  ],
  controllers: [AuctionItemController],
  providers: [AuctionItemService],
  exports: [AuctionItemService],
})
export class AuctionItemModule {}
