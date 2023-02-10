import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuctionBid } from './schemas/auctionBid.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AuctionItem } from '../auction-item/schemas/auctionItem.schema';
import mongoose from 'mongoose';
import { AuctionItemService } from '../auction-item/auction-item.service';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class AuctionBidService {
  constructor(
    @InjectModel(AuctionBid.name)
    private auctionBidModel: mongoose.Model<AuctionBid>,
    private itemItemService: AuctionItemService,
  ) {}

  async create(id: string, auctionBid: AuctionBid, user): Promise<AuctionBid> {
    const auctionItem = await this.itemItemService.findItemById(id, user);

    if (auctionItem && this.isOwner(auctionItem, user)) {
      throw new BadRequestException('You are  the owner of this auction.');
    } else if (auctionItem && auctionItem.state !== 'ongoing') {
      throw new BadRequestException('Auction is not ongoing.');
    } else if (!auctionItem) {
      throw new NotFoundException('AuctionItem not found.');
    }

    if (auctionItem.state !== 'ongoing') {
      throw new BadRequestException('Auction is not ongoing.');
    }

    //check if auctionItem.windowTime is found and expired
    if (auctionItem.timeWindow && auctionItem.timeWindow < new Date()) {
      await this.itemItemService.editStateOfAuctionItem(
        id,
        'completed',
        user,
        true,
      );
      throw new BadRequestException('Auction is closed.');
    }

    //same user can't bid one time in 5 seconds
    if (auctionItem && auctionItem.bids && auctionItem.bids.length > 0) {
      //get the last bid made by user
      const reversedBids = auctionItem.bids.reverse();
      console.log('reversedBids', reversedBids);
      const lastBid = reversedBids.find(
        (bid) => bid.owner.toString() === user._id.toString(),
      );

      if (lastBid) {
        console.log('lastBid', lastBid);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const lastBidTime = new Date(lastBid.createdAt);
        const currentTime = new Date();
        const diff = currentTime.getTime() - lastBidTime.getTime();
        const seconds = Math.floor(diff / 1000);
        if (seconds < 5) {
          throw new BadRequestException(
            'You can not bid again in less than 5 seconds.',
          );
        }
      }
    }

    if (
      !auctionItem.highestBid &&
      auctionBid.amount <= auctionItem.startPrice
    ) {
      throw new BadRequestException('Bid amount is less than starting price.');
    }

    if (auctionItem.highestBid) {
      //get highest bid
      const highestBid = await this.auctionBidModel.findById(
        auctionItem.highestBid,
      );
      if (auctionBid.amount <= highestBid.amount)
        throw new BadRequestException('Bid amount is less than highest bid.');
    }

    const data = Object.assign(auctionBid, {
      owner: user._id,
      auctionItem: id,
      amount: auctionBid.amount,
    });

    const res = await this.auctionBidModel.create(data);
    //add bid to auctionItem
    await this.itemItemService.addBidToAuctionItem(id, res, user);
    //set highest bid
    await this.itemItemService.setHighestBid(id, res);

    return res;
  }

  isOwner(object, user) {
    return object.owner && object.owner.toString() === user._id.toString();
  }

  async findById(id: string): Promise<AuctionBid> {
    const bid = await this.auctionBidModel.findById(id);
    if (!bid) {
      throw new NotFoundException('AuctionBid not found.');
    }
    return bid;
  }
}
