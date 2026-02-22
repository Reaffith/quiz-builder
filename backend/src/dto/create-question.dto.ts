/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  type: 'INPUT' | 'SINGLEOPTION' | 'MULTIPLEOPTION';

  @IsString()
  @IsNotEmpty()
  text: string;

  options?: Record<string, any> | null;

  correctAnswer?: Record<string, any> | null;

  @IsNotEmpty()
  order: number;
}
