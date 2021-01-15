import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true }) // means it can be null
  name: string;

  @Column('text', { unique: true }) // { unique: true } is a constraint!
  githubId: string;
}
