import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<void> {
    const isEqual = await bcrypt.compare(password, passwordHash);
    if (!isEqual) {
      throw new UnauthorizedException();
    }
  }
}
