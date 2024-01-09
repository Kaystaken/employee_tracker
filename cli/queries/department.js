const mysql = require('mysql2/promise');
const DBConnection = require('./connections');
const dbconnection = new DBConnection();

class Department {
  constructor() {}

  async addDepartment(departmentName) {
    const sql = 'insert into department(name) values (?)';
    const db = dbconnection.main();
    return (await db).query(sql, departmentName);
  }

  async viewDepartment() {
    const sql =
      'SELECT id, name FROM department';
    const db = dbconnection.main();
    return (await db).query(sql);
  }

  async listDepartment() {
    const sql = 'SELECT id, name FROM department';
    const db = dbconnection.main();
    return (await db).query(sql);
  }

  async viewBudgetofDepartment(departmentId) {
    const sql =
      `select sum(role.salary) as 'total utilized budget'
      FROM role
      INNER JOIN employee ON role.id=employee.role_id AND role.department_id=? GROUP BY department_id`;
    const db = dbconnection.main();
    return (await db).query(sql, departmentId);
  }
}

module.exports = Department;