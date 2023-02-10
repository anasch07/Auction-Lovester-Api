import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @Prop({ required: [true, 'Name is required'] })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'anas@anas.com',
  })
  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '123456',
  })
  @Prop({ required: [true, 'Password is required'] })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
