import { IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { AuctionItem } from '../../auction-item/schemas/auctionItem.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBidDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The amount of the bid',
    example: 100,
  })
  amount: number;

  @ApiProperty({
    description: 'The user id',
    example: '63e57027c63c21be19f38c4d',
  })
  @IsEmpty({ message: 'You cannot pass user id' })
  readonly owner: User;

  @ApiProperty({
    description: 'The auction item id',
    example: '63e57027c63c21be19f38c4d',
  })
  @IsEmpty({ message: 'You cannot pass auction item id' })
  readonly item: AuctionItem;
}
