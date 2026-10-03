import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "touristguide",
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();

    console.log("✅ MySQL connected successfully!");
    console.log(`📦 Database: ${process.env.DB_NAME || "touristguide"}`);

    connection.release();

    return true;
  } catch (error) {
    console.error("❌ MySQL connection failed!");
    console.error("Error:", error.message);

    return false;
  }
}

export default pool;