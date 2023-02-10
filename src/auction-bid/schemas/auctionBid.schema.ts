import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { AuctionItem } from '../../auction-item/schemas/auctionItem.schema';

@Schema({
  timestamps: true,
})
export class AuctionBid {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AuctionItem' })
  item: AuctionItem;

  @Prop()
  amount: number;
}

export const AuctionBidSchema = SchemaFactory.createForClass(AuctionBid);
