import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuctionItemService } from './auction-item.service';
import { CreateAuctionItemDto } from './dto/create-auctionItem.dto';

import { AuctionItem } from './schemas/auctionItem.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../decorators/user.decorator';
import { isValidId } from '../pipes/isValidId.pipe';
import { UpdateAuctionItemDto } from './dto/update-auctionItem.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auction-item')
@ApiTags('auction-item')
export class AuctionItemController {
  constructor(private auctionItemService: AuctionItemService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The auction item has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @UseGuards(AuthGuard())
  async createAuctionItem(
    @Body()
    auctionItem: CreateAuctionItemDto,
    @User() user,
  ): Promise<AuctionItem> {
    return this.auctionItemService.create(auctionItem, user);
  }

  @Patch('/publish/:id')
  @UseGuards(AuthGuard())
  async publishAuctionItem(
    @Param('id', isValidId)
    id: string,
    @User() user,
  ) {
    return this.auctionItemService.editStateOfAuctionItem(
      id,
      'ongoing',
      user,
      false,
    );
  }

  @Patch('/complete/:id')
  @ApiCreatedResponse({
    description: 'The auction item has been successfully completed.',
  })
  @ApiBadRequestResponse({ description: 'You cannot complete this item.' })
  @UseGuards(AuthGuard())
  async completeAuctionItem(
    @Param('id', isValidId)
    id: string,
    @User() user,
  ) {
    return this.auctionItemService.editStateOfAuctionItem(
      id,
      'completed',
      user,
      false,
    );
  }

  @Get('myItems')
  @ApiCreatedResponse({
    description: 'The auction item has been successfully completed.',
  })
  @ApiBadRequestResponse({ description: 'You cannot complete this item.' })
  @UseGuards(AuthGuard())
  async getMyAuctionItems(
    @Query() query: ExpressQuery,
    @User() user,
  ): Promise<AuctionItem[]> {
    return this.auctionItemService.findAuctionItems(query, {
      owner: user._id,
    });
  }

  @Get('/completedOngoing')
  @UseGuards(AuthGuard())
  async getCompletedOngoingAuctionItems(
    @Query() query: ExpressQuery,
    @User() user,
  ): Promise<AuctionItem[]> {
    return this.auctionItemService.findAuctionItems(query, {
      // state: 'ongoing or completed',
      // @ts-ignore
      state: { $in: ['completed', 'ongoing'] },
    });
  }

  @Get('/completed')
  async getCompletedAuctionItems(
    @Query()
    query: ExpressQuery,
    @User()
    user,
  ): Promise<AuctionItem[]> {
    return this.auctionItemService.findAuctionItems(query, {
      state: 'completed',
    });
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  async updateAuctionItem(
    @Param('id', isValidId)
    id: string,
    @Body()
    auctionItem: UpdateAuctionItemDto,
    @User()
    user,
  ) {
    return this.auctionItemService.updateAuctionItem(id, auctionItem, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteAuctionItem(
    @Param('id', isValidId)
    id: string,
    @User()
    user,
  ) {
    return this.auctionItemService.deleteAuctionItem(id, user);
  }

  //find by id
}
