import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddAccessLogsTable1701760316938 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE access_log (
            id SERIAL PRIMARY KEY,
            ip_address TEXT NOT NULL,
            accessed_at TIMESTAMP WITH TIME ZONE NOT NULL
        );
    `)

    await queryRunner.query(`
        CREATE INDEX access_log_accessed_at_idx ON access_log (accessed_at DESC);
    `)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX IF EXISTS access_log_accessed_at_idx;
    `)

    await queryRunner.query(`
        DROP TABLE IF EXISTS access_log;
    `)
  }
}
