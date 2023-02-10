import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { AuctionBid } from '../../auction-bid/schemas/auctionBid.schema';

export enum State {
  DRAFT = 'draft',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}
@Schema({
  timestamps: true,
})
export class AuctionItem {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ default: State.DRAFT })
  state: string;

  @Prop()
  startPrice: number;

  @Prop({
    type: {},
    default: null,
  })
  highestBid: AuctionBid;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({
    type: [],
    default: [],
  })
  bids: AuctionBid[];

  @Prop({
    default: null,
  })
  timeWindow: Date;
}

export const AuctionItemSchema = SchemaFactory.createForClass(AuctionItem);
