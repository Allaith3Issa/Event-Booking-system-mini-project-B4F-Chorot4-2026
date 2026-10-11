import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  ALLOWED_EVENTS_CATEGORIES,
  EventsCategories,
  SORT_BY_VERDICTS,
  SortBy,
} from '../../types';

export class EventsQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_EVENTS_CATEGORIES, {
    message: `Category must be one of the following: ${ALLOWED_EVENTS_CATEGORIES.join(', ')}`,
  })
  category?: EventsCategories;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @IsDateString(
    { strict: true },
    { message: 'Date must be in YYYY-MM-DD format' },
  )
  date?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  availableOnly?: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  includePast?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(SORT_BY_VERDICTS, {
    message: `sortBy must be one of the following: ${SORT_BY_VERDICTS.join(', ')}`,
  })
  sortBy?: SortBy;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  asc?: boolean;
}
