import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

/*
 * CurrencyRate entity
 */
@Entity('currency_rate')
export class CurrencyRate {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ type: 'text', nullable: false })
    base: string

  @Column({ type: 'json', nullable: false })
    rates: Record<string, number>

  @Column({ type: 'timestamp with time zone', nullable: false, name: 'rates_changed_at' })
    ratesChangedAt: Date

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @Index()
    createdAt: Date
}
