import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddCurrencyRatesTable1700752559815 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE currency_rate (
            id SERIAL PRIMARY KEY,
            base TEXT NOT NULL,
            rates JSON NOT NULL,
            rates_changed_at TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `)
    await queryRunner.query(`
      CREATE INDEX idx_currency_rate_created_at ON currency_rate (created_at DESC);
  `)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX IF EXISTS idx_currency_rate_created_at;
  `)
    await queryRunner.query(`
        DROP TABLE IF EXISTS currency_rate;
    `)
  }
}
