const mysql = require('mysql2/promise');
const DBConnection = require('./connections');
const dbconnection = new DBConnection();

class Role {
  constructor() {}

  async addRole(title, salary, departmentId) {
    const params = [title, parseFloat(salary), departmentId];
    const sql = 'insert into role(title, salary, department_id) values (?,?,?)';
    const db = dbconnection.main();
    return (await db).query(sql, params);
  }
  
  async viewRole() {
    const sql =
      'SELECT role.id as id, role.title, role.salary, department.name as department FROM role INNER JOIN department on role.department_id=department.id';
    const db = dbconnection.main();
    return (await db).query(sql);
  }

  async listRole() {
    const sql = 'SELECT id, title FROM role';
    const db = dbconnection.main();
    return (await db).query(sql);
  }
}

module.exports = Role;