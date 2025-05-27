import mysql from 'mysql2/promise';
import { ICreateRequest } from '../../core/interfaces/inbound/ICreateRequest';
import { IRdsRepository } from '../../core/interfaces/outbound/IRdsRepository';

export class RdsRepositoryPE implements IRdsRepository {
  private pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async putItem(item:ICreateRequest): Promise<void> {
    try {
      const sql = `INSERT INTO appointments_pe (insuredId, scheduleId, countryISO) VALUES (?, ?, ?)`;
      let [result] = await this.pool.execute(sql, [item.insuredId, item.scheduleId, item.countryISO]);
      console.log("Insert result:", result);
      return (result as any).insertId;
    } catch (error) {
      console.error("Error inserting appointment in RDS (PE):", error instanceof Error ? error.message : error);
      console.error("Stack:", error instanceof Error ? error.stack : '');
      throw new Error("RDS PE insert failed");
    }
  }
}