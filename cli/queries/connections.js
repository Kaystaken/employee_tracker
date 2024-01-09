const mysql = require("mysql2/promise");

class DBConnection {
  constructor() {}
  async main() {
    // Connect to database using Promise API
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "employees_db",
      password: "",
    });

    return connection;
  }
}
module.exports = DBConnection;