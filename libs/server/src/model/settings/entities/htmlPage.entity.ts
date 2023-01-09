import type { ObjectId } from 'mongodb';
import { Column, Entity, Index } from 'typeorm';
import type { Class } from 'utility-types';
import { HtmlFieldsMap, HtmlPageModel } from '@vpo-help/model';
import { baseEntityWith, EntityConstructorData } from '../../common';

@Entity({ name: 'html_page' })
export class HtmlPageEntity extends baseEntityWith(
  HtmlPageModel as Class<HtmlPageModel<ObjectId>>,
) {
  @Index('idx_html_page_name')
  @Column()
  name!: string;

  @Column()
  content!: HtmlFieldsMap;

  constructor(data: EntityConstructorData<HtmlPageEntity>) {
    super(data);
  }
}
