import { IUniqueIDGeneratorProvider } from '@application/adapters/providers/unique-id-generator';
import { v4 } from 'uuid';

export class UuidV4Generator implements IUniqueIDGeneratorProvider {
  generate(): string {
    return v4();
  }
}