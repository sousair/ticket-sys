import { UuidV4Generator } from '@infra/providers/unique-id-generator/uuid-v4';

export class UuidV4GeneratorFactory {
  static instance: UuidV4Generator;

  static getInstance(): UuidV4Generator {
    if (this.instance) return this.instance;

    this.instance = new UuidV4Generator();

    return this.instance;
  }
}
