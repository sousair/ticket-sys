import { Email } from '@entities/email';
import { User } from '@entities/user';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn({ type: 'char' })
    id: string;

  @Column({ type: 'varchar' })
    email: string;

  @Column({ type: 'boolean', name: 'email_validated' })
    emailValidated: boolean;

  @Column({ type: 'varchar' ,name: 'password' })
    hashedPassword: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;

  static formatToDomainEntity({ id, email, emailValidated, hashedPassword }: UserEntity): User {
    return new User({
      id,
      email: new Email(email),
      emailValidated,
      hashedPassword,
    });
  }
}
