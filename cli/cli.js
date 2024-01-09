const inquirer = require('inquirer');
const Employee = require('./queries/employee');
const Department = require('./queries/department');
const Role = require('./queries/role');

const employee = new Employee();
const department = new Department();
const role = new Role();

const questions = [
  {
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: [
      'View all Departments',
      'View all Roles',
      'View all Employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update an Employee Role',
      'View Employees by Manager',
      'View Employees by Department',
      'Total Utilized Budget of a Department',
      'Quit',
    ],
    filter(value) {
      return value.toLowerCase();
    },
  },
];

function run() {
  inquirer.prompt(questions).then((answers) => {
    answers.option = answers.option.replace(/\s/g, '');
    switch (answers.option) {
      case 'viewalldepartments':
        const departmentList = department.viewDepartment();
        departmentList.then(
          function (value) {
            console.table(value[0]);
          },
          function (error) {
            console.log(error);
          }
        );
        break;
      case 'viewallroles':
        const roleList = role.viewRole();
        roleList.then(
          function (value) {
            console.table(value[0]);
          },
          function (error) {
            console.log(error);
          }
        );
        break;
      case 'viewallemployees':
        const employeeList = employee.viewEmployee();
        employeeList.then(
          function (value) {
            console.table(value[0]);
          },
          function (error) {
            console.log(error);
          }
        );
        break;
      case 'addadepartment':
        addDepartment();
        break;
      case 'addarole':
        addRole();
        break;
      case 'addanemployee':
        addEmployee();
        break;
      case 'updateanemployeerole':
        updateEmployeeRole();
        break;
      case 'viewemployeesbymanager':
        viewEmployeesByManager();
        break;
      case 'viewemployeesbydepartment':
        viewEmployeesByDepartment();
        break;
      case 'totalutilizedbudgetofadepartment':
        viewBudgetofDepartment();
        break;
      case 'quit':
        break;
    }
    if (
      answers.option == 'viewalldepartments' ||
      answers.option == 'viewallroles' ||
      answers.option == 'viewallemployees'
    ) {
      setTimeout(() => {
        run();
      }, 1000);
    } else if (answers.option == 'quit') {
      return;
    }
  });
}

async function viewBudgetofDepartment() {
  const [departments] = await department.listDepartment();
  const departmentList = departments.map((item) => item.name);
  const answers = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'departmentName',
        message: 'Choose department',
        choices: departmentList,
      },
    ]);

  const departmentId = departments.find(
    (department) => department.name === answers.departmentName
  ).id;

  try {
    const budgetByDepartment = await department.viewBudgetofDepartment(departmentId);
    console.table(budgetByDepartment[0]);
    run();
  } catch (err) {
    console.log(err);
  }
}

async function viewEmployeesByDepartment() {
  const [departments] = await department.listDepartment();
  const departmentList = departments.map((item) => item.name);
  const answers = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'departmentName',
        message: 'Choose department',
        choices: departmentList,
      },
    ]);

  const departmentId = departments.find(
    (department) => department.name === answers.departmentName
  ).id;

  try {
    const employeeByDepartment = await employee.viewEmployeeByDepartment(departmentId);
    console.table(employeeByDepartment[0]);
    run();
  } catch (err) {
    console.log(err);
  }
}

async function viewEmployeesByManager() {
  const [employees] = await employee.listEmployee();
  const employeeList = employees.map((item) => item.employee_name);
  const answers = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'employeeName',
        message: 'Choose employee',
        choices: employeeList,
      },
    ]);

  const managerId = employees.find(
    (manager) => manager.employee_name === answers.employeeName
  ).id;

  try {
    const employeeByManager = await employee.viewEmployeeByManager(managerId);
    console.table(employeeByManager[0]);
    run();
  } catch (err) {
    console.log(err);
  }
}

async function updateEmployeeRole() {
  const [employees] = await employee.listEmployee();
  const employeesList = employees.map((item) => item.employee_name);
  const [roles] = await role.listRole();
  const roleTitle = roles.map((item) => item.title);
  const answers = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'employeeName',
        message: 'Choose employee to update',
        choices: employeesList,
      },
      {
        type: 'list',
        name: 'roleTitle',
        message: 'Choose role',
        choices: roleTitle,
      },
    ]);

  const employeeId = employees.find(
    (employee) => employee.employee_name === answers.employeeName
  ).id;
  const roleId = roles.find((role) => role.title === answers.roleTitle).id;
  
  try {
    await employee.updateEmployeeRole(roleId, employeeId);
    console.log(`Employee Updated Successfully`);
    run();
  } catch (err) {
    console.log(err);
  }
}

function addDepartment() {
  const questions = [
    {
      type: 'input',
      name: 'newDepartment',
      message: 'Enter name of the department',
    },
  ];
  inquirer.prompt(questions).then((answers) => {
    const newDepartment = department.addDepartment(answers.newDepartment);
    newDepartment.then(
      function () {
        console.log(`Department ${answers.newDepartment} Added Successfully`);
        run();
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

async function addRole() {
  const [departments] = await department.listDepartment();
  const departmentNames = departments.map((item) => item.name);

  const answers = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'newRole',
        message: 'Enter new role name',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter salary for the role',
      },
      {
        type: 'list',
        name: 'departmentName',
        message: 'Choose department for the new role',
        choices: departmentNames,
      },
    ]);

  const departmentId = departments.find(
    (department) => department.name === answers.departmentName
  ).id;
  try {
    await role.addRole(
      answers.newRole,
      answers.salary,
      departmentId
    );
    console.log(`Role ${answers.newRole} Added Successfully`);
    run();
  } catch (err) {
    console.log(err);
  }
}

async function addEmployee() {
  const [managers] = await employee.listEmployee();
  const managersList = managers.map((item) => item.employee_name);
  managersList.push('None');
  console.log('manager list:', managersList);
  const [roles] = await role.listRole();
  const roleTitle = roles.map((item) => item.title);
  const answers = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter first name',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter last name',
      },
      {
        type: 'list',
        name: 'roleTitle',
        message: 'Choose role',
        choices: roleTitle,
      },
      {
        type: 'list',
        name: 'managerName',
        message: 'Choose manager',
        choices: managersList,
      },
    ]);

  const managerId = managers.find(
    (manager) => manager.employee_name === answers.managerName
  )?.id;
  const roleId = roles.find((role) => role.title === answers.roleTitle).id;

  try {
    await employee.addEmployee(
      answers.firstName,
      answers.lastName,
      roleId,
      managerId
    );
    console.log(`Employee Added Successfully`);
    run();
  } catch (err) {
    console.log(err);
  }
}

module.exports = { run };