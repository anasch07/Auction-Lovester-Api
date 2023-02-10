import {
  IsDate,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinDate,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { State } from '../schemas/auctionItem.schema';
import { AuctionBid } from '../../auction-bid/schemas/auctionBid.schema';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuctionItemDto {
  @ApiProperty({
    description: 'The title of the auction item',
    example: 'Auction item title',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the auction item',
    example: 'Auction item description',
  })
  @IsOptional()
  @IsString()
  description: string;

  @IsEmpty({ message: 'You cannot pass state' })
  readonly state: State;

  @IsEmpty({ message: 'You cannot add start price' })
  readonly startPrice: number;

  @IsEmpty({ message: 'You cannot pass highest bid' })
  readonly highestBid: AuctionBid;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly owner: User;

  @IsEmpty({ message: 'You cannot pass bids' })
  readonly bids: AuctionBid[];

  @ApiProperty({
    description: 'The time window of the auction item',
    example: '2023-02-10T02:53:17.465Z',
  })
  @IsOptional()
  @MinDate(new Date(), { message: 'Time window must be in the future' })
  @Transform(({ value }) => new Date(value))
  timeWindow: Date;
}
