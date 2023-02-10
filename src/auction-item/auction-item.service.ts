import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel, Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuctionItem, State } from './schemas/auctionItem.schema';

import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
import { AuctionBid } from '../auction-bid/schemas/auctionBid.schema';

@Injectable()
export class AuctionItemService {
  constructor(
    @InjectModel(AuctionItem.name)
    private auctionItemModel: mongoose.Model<AuctionItem>,
  ) {}

  async create(auctionItem: AuctionItem, user: User): Promise<AuctionItem> {
    const data = Object.assign(auctionItem, {
      owner: user._id,
    });
    const res = await this.auctionItemModel.create(data);
    return res;
  }

  async editStateOfAuctionItem(
    id: string,
    state: string,
    user: User,
    isAdmin: boolean,
  ): Promise<AuctionItem> {
    const auctionItem = await this.auctionItemModel.findById(id);

    if (auctionItem && !isAdmin && !this.isOwner(auctionItem, user)) {
      throw new BadRequestException('You cannot edit this auction.');
    } else if (!auctionItem) {
      throw new NotFoundException('AuctionItem not found.');
    }

    if (state === 'draft') {
      throw new BadRequestException('You cannot set the state to draft.');
    }

    if (auctionItem.state && auctionItem.state === 'completed') {
      throw new BadRequestException(
        'You cannot edit a completed or ongoing auction.',
      );
    }

    auctionItem.state = state;
    auctionItem.save();

    return auctionItem;
  }

  isOwner(object, user) {
    return object.owner && object.owner.toString() === user._id.toString();
  }

  async findAuctionItems(
    query: Query,
    conditions: { state?: string; owner?: any },
  ): Promise<AuctionItem[]> {
    const resPerPage = 9;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const sortCriteria = query.sortCriteria;

    let sortBy;
    if (sortCriteria === 'latest') {
      sortBy = { createdAt: -1 };
    } else if (sortCriteria === 'highest') {
      sortBy = { 'highestBid.amount': -1 };
    }

    const auctionItems = await this.auctionItemModel
      //state is completed or ongoing
      .find(conditions)
      .sort(sortBy)
      .limit(resPerPage)
      .skip(skip);

    return auctionItems;
  }

  async updateAuctionItem(
    id: string,
    auctionItem: AuctionItem,
    user: User,
  ): Promise<AuctionItem> {
    const auctionItemFound = await this.auctionItemModel.findById(id);

    if (auctionItemFound && !this.isOwner(auctionItemFound, user)) {
      throw new BadRequestException('You are not the owner of this auction.');
    } else if (!auctionItem) {
      throw new NotFoundException('AuctionItem not found.');
    }

    if (
      auctionItemFound.state &&
      (auctionItemFound.state === 'completed' ||
        auctionItemFound.state === 'ongoing')
    ) {
      throw new BadRequestException(
        'You cannot edit a completed or ongoing auction.',
      );
    }

    auctionItemFound.title = auctionItem.title || auctionItemFound.title;
    auctionItemFound.description =
      auctionItem.description || auctionItemFound.description;
    auctionItemFound.timeWindow =
      auctionItem.timeWindow || auctionItemFound.timeWindow;

    auctionItemFound.save();

    return auctionItemFound;
  }

  async findItemById(id: string, user: User): Promise<AuctionItem> {
    const auctionItem = await this.auctionItemModel.findById(id);
    if (!auctionItem) {
      throw new NotFoundException('AuctionItem not found.');
    }

    if (auctionItem && this.isOwner(auctionItem, user)) {
      return auctionItem;
    }

    if (auctionItem.state === 'ongoing' || auctionItem.state === 'completed') {
      return auctionItem;
    }

    console.log('auctionItem.state: ', auctionItem);

    throw new BadRequestException('You cannot access this auction.');
  }

  async addBidToAuctionItem(
    id: string,
    bid: AuctionBid,
    user: User,
  ): Promise<void> {
    const auctionItem = await this.auctionItemModel.findById(id);

    if (!auctionItem) {
      throw new NotFoundException('AuctionItem not found.');
    } else if (auctionItem.state !== 'ongoing') {
      throw new BadRequestException('You cannot bid on a completed auction.');
    } else if (auctionItem.owner.toString() === user._id.toString()) {
      throw new BadRequestException('You cannot bid on your own auction.');
    }

    auctionItem.bids.push(bid);
    auctionItem.save();
  }

  async setHighestBid(id: string, bid: AuctionBid): Promise<void> {
    const auctionItem = await this.auctionItemModel.findById(id);

    if (!auctionItem) {
      throw new NotFoundException('AuctionItem not found.');
    } else if (auctionItem.state !== 'ongoing') {
      throw new BadRequestException('You cannot bid on a completed auction.');
    } else if (
      auctionItem.highestBid &&
      auctionItem.highestBid.amount >= bid.amount
    ) {
      throw new BadRequestException('The bid amount is too low.');
    }

    console.log('bid: ', bid);

    auctionItem.highestBid = bid;

    auctionItem.save();
  }

  async deleteAuctionItem(id: string, user: User): Promise<AuctionItem> {
    const auctionItem = await this.auctionItemModel.findById(id);

    if (!auctionItem) {
      throw new NotFoundException('AuctionItem not found.');
    } else if (!this.isOwner(auctionItem, user)) {
      throw new BadRequestException('You cannot delete this auction.');
    }

    //if the state is ongoing or completed, the auction cannot be deleted
    if (auctionItem.state !== 'draft') {
      throw new BadRequestException(
        'You cannot delete an ongoing or completed auction.',
      );
    }

    auctionItem.delete();

    return auctionItem;
  }
}
