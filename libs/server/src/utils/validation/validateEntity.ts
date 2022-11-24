import type { ClassConstructor } from 'class-transformer';
import { ClassValidationPipe } from './classValidation.pipe';

const pipe = new ClassValidationPipe({
  validateCustomDecorators: true,
});

export async function validateEntity<T>(
  classParam: ClassConstructor<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
): Promise<T> {
  return pipe.transform(value, {
    type: 'custom',
    metatype: classParam,
  }) as Promise<T>;
}
