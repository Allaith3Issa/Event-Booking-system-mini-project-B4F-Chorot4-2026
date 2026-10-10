import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer name is required' })
  customerName!: string;

  @IsString()
  @IsNotEmpty({ message: 'A valid phone number is required' })
  customerPhone!: string;

  @IsInt({
    message: 'Places must be a whole number between 1 and 4',
  })
  @Min(1, {
    message: 'Places must be a whole number between 1 and 4',
  })
  @Max(4, {
    message: 'Places must be a whole number between 1 and 4',
  })
  places!: number;

  @IsInt({ message: 'Event ID must be a positive integer' })
  @Min(1, { message: 'Event ID must be a positive integer' })
  eventId!: number;
}
