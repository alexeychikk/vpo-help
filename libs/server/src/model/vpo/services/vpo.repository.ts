import type { OnModuleInit } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../common';
import { VpoEntity } from '../entities';

@EntityRepository(VpoEntity)
export class VpoRepository
  extends BaseEntityRepository<VpoEntity>
  implements OnModuleInit
{
  async onModuleInit() {
    await this.createCollectionIndex(
      {
        vpoReferenceNumber: 'text',
        firstName: 'text',
        lastName: 'text',
        middleName: 'text',
        phoneNumber: 'text',
        addressOfRegistration: 'text',
        addressOfResidence: 'text',
        email: 'text',
      },
      { name: 'idx_vpo_search' },
    );
  }

  async findByReferenceNumber(vpoReferenceNumber: string): Promise<VpoEntity> {
    const entity = await this.findOne({ vpoReferenceNumber });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async findByScheduleDate(
    from: Date,
    to?: Date,
  ): Promise<Pick<VpoEntity, 'id' | 'scheduleDate'>[]> {
    return this.find({
      where: {
        $and: [
          { scheduleDate: { $gte: from } },
          to && { scheduleDate: { $lte: to } },
        ].filter(Boolean),
      },
      select: ['id', 'scheduleDate'],
    });
  }
}
