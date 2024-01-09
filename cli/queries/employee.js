const mysql = require('mysql2/promise');
const DBConnection = require('./connections');
const dbconnection = new DBConnection();

class Employee {
  constructor() {}

  async viewEmployee() {
    const sql =
      `SELECT e.id, e.first_name, e.last_name, role.title, department.name, role.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
       FROM employee e
       INNER JOIN role on e.role_id = role.id
       INNER JOIN department on role.department_id = department.id
       LEFT JOIN employee m on m.id = e.manager_id`;
    const db = dbconnection.main();
    return (await db).query(sql);
  }

  async listEmployee() {
    const sql =
      `SELECT id, CONCAT(first_name, ' ', last_name) as employee_name FROM employee`;
    const db = dbconnection.main();
    return (await db).query(sql);
  }

  async addEmployee(firstName, lastName, roleId, managerId) {
    const params = [firstName, lastName, roleId, managerId];
    const sql =
      'insert into employee(first_name, last_name, role_id, manager_id) values (?,?,?,?)';
    const db = dbconnection.main();
    return (await db).query(sql, params);
  }

  async updateEmployeeRole(roleId, employeeId) {
    const params = [roleId, employeeId];
    const sql = 'update employee set role_id=? where id=?';
    const db = dbconnection.main();
    return (await db).query(sql, params);
  }

  async viewEmployeeByManager(managerId) {
    const sql =
      'SELECT id, first_name, last_name FROM employee where manager_id=?';
    const db = dbconnection.main();
    return (await db).query(sql, managerId);
  }

  async viewEmployeeByDepartment(departmentId) {
    const sql =
      'select * from employee where role_id in (select id from role where department_id=?);';
    const db = dbconnection.main();
    return (await db).query(sql, departmentId);
  }
}

module.exports = Employee;