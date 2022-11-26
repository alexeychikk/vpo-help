import { IsAlphanumeric, IsObject, Length } from 'class-validator';
import type { Optional } from 'utility-types';
import type { IdType } from '../common';
import { BaseModel } from '../common';

export type HtmlFieldsMap = Record<string, string>;

export class HtmlPageModel<Id extends IdType = IdType> extends BaseModel<Id> {
  @Length(1, 100)
  @IsAlphanumeric()
  name!: string;

  @IsObject()
  content!: HtmlFieldsMap;

  constructor(data: Optional<HtmlPageModel<Id>, keyof BaseModel<Id>>) {
    super();
    Object.assign(this, data);
  }
}

export class UpdateHtmlPageDto {
  @IsObject()
  content!: HtmlFieldsMap;

  constructor(data: Optional<UpdateHtmlPageDto>) {
    Object.assign(this, data);
  }
}
