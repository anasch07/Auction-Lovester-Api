import {
  IsEmpty,
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

// @ts-ignore
// @ts-ignore
// @ts-ignore
export class CreateAuctionItemDto {
  @ApiProperty({
    description: 'The title of the auction item',
    example: 'Auction item title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the auction item',
    example: 'Auction item description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The state of the auction item',
    example: 'completed',
  })
  @IsEmpty({ message: 'You cannot pass state' })
  readonly state: State;

  @ApiProperty({
    description: 'The start price of the auction item',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  startPrice: number;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @ApiProperty({
    description: 'The highest bid of the auction item',
    example: {
      amount: 100,
      owner: '63e57027c63c21be19f38c4d',
      _id: '63e5b19db17cb4fe0694957c',
      createdAt: '2023-02-10T02:53:17.465Z',
      updatedAt: '2023-02-10T02:53:17.465Z',
      __v: 0,
    },
  })
  @IsEmpty({ message: 'You cannot pass highest bid' })
  readonly highestBid: AuctionBid;

  @ApiProperty({
    description: 'The owner of the auction item',
    example: '63e57027c63c21be19f38c4d',
  })
  @IsEmpty({ message: 'You cannot pass user id' })
  readonly owner: User;

  @ApiProperty({
    description: 'The bids of the auction item',
    example: [
      {
        amount: 100,
        owner: '63e57027c63c21be19f38c4d',
        _id: '63e5b19db17cb4fe0694957c',
        createdAt: '2023-02-10T02:53:17.465Z',
        updatedAt: '2023-02-10T02:53:17.465Z',
        __v: 0,
      },
    ],
  })
  @IsEmpty({ message: 'You cannot pass bids' })
  readonly bids: AuctionBid[];

  @ApiProperty()
  @IsOptional()
  @MinDate(new Date(), { message: 'Time window must be in the future' })
  @Transform(({ value }) => new Date(value))
  timeWindow: Date;
}
