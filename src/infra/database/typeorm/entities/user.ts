import { Email } from '@entities/email';
import { User } from '@entities/user';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn()
    id: string;

  @Column()
    email: string;

  @Column({ name: 'email_validated' })
    emailValidated: boolean;

  @Column({ name: 'password' })
    hashedPassword: string;

  @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
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
