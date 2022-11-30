import { IsObject, IsOptional, Length, Matches } from 'class-validator';
import type { Optional } from 'utility-types';
import { composeDecorators } from '@vpo-help/utils';
import type { IdType, ModelConstructorData } from '../common';
import { BaseModel } from '../common';

export type HtmlFieldsMap = Record<string, string>;

const IsPageName = () =>
  composeDecorators(Length(1, 100), Matches(/^[0-9A-Z-_]+$/i));

export class HtmlPageModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @IsPageName()
  name!: string;

  @IsObject()
  content!: HtmlFieldsMap;

  constructor(data: ModelConstructorData<HtmlPageModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}

export class UpdateHtmlPageDto {
  @IsPageName()
  @IsOptional()
  name?: string;

  @IsObject()
  content!: HtmlFieldsMap;

  constructor(data: Optional<UpdateHtmlPageDto>) {
    Object.assign(this, data);
  }
}

export class FindByPageNameDto {
  @IsPageName()
  name!: string;

  constructor(data: FindByPageNameDto) {
    Object.assign(this, data);
  }
}
