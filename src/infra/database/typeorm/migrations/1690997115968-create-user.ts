import { DeleteDateColumn, MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateUser1690997115968 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'CHAR',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          }),
          new TableColumn({
            name: 'email',
            type: 'VARCHAR(255)',
            isUnique: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'email_validated',
            type: 'boolean',
            isNullable: false,
            default: false,
          }),
          new TableColumn({
            name: 'password',
            type: 'VARCHAR(255)',
            isNullable: false,
          }),
          new TableColumn({
            name: 'created_at',
            type: 'TIMESTAMP',
            isNullable: false,
            default: 'now()',
          }),
          new TableColumn({
            name: 'updated_at',
            type: 'TIMESTAMP',
            isNullable: false,
            default: 'now()',
            onUpdate: 'now()',
          }),
          new TableColumn({
            name: 'deleted_at',
            type: 'TIMESTAMP',
            isNullable: true,
          }),
        ],
      }),
      true,
      true,
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
