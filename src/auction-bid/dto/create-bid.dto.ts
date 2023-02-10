import { IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { AuctionItem } from '../../auction-item/schemas/auctionItem.schema';

export class CreateBidDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly owner: User;

  @IsEmpty({ message: 'You cannot pass auction item id' })
  readonly item: AuctionItem;
}
