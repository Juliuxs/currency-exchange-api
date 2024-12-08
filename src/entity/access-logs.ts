import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

/*
 * AccessLog entity
 */
@Entity('access_log')
export class AccessLog {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ type: 'text', nullable: false, name: 'ip_address' })
    ipAddress: string

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'accessed_at'
  })
  @Index()
    accessedAt: Date
}
