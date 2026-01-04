import { IsString, ArrayNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { LastFmPeriod } from 'src/enums/LastFmPeriod.enum';
import { Transform } from 'class-transformer';

export class ChartsDto {
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  users: string[];

  @IsEnum(LastFmPeriod)
  @IsOptional()
  @Transform(({ value }) => LastFmPeriod[value as keyof typeof LastFmPeriod])
  period: LastFmPeriod;
}
