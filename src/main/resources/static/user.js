// заполняем navbar
const REST_AUT_USER = "http://localhost:8081/api/AuthenticatedUser";

const navbarEmail = document.getElementById('navbar-email');
const navbarRoles = document.getElementById('navbar-roles');

fetch(REST_AUT_USER)
    .then(response => response.json())
    .then(data => {
        navbarEmail.innerText = data.email;

        let roles = "";
        data.role.forEach((role) => roles += role.type);

        navbarRoles.innerText = roles

    })

// заполняем таблицу

const users_table = document.getElementById("Users-table-body");

let tmp_users_table = "";

const updateTable = () => {
    fetch(REST_AUT_USER)
        .then(response => response.json())
        .then(data => showUsers(data))
}

// шаблон таблицы
const showUsers = (data) => {

    users_table.innerHTML = "";

    let tmp_roles = "";

        // получаем роли пользователя
        data.role.forEach((role) => tmp_roles += role.type + " ");

        // заполняем таблицу шаблоном
        tmp_users_table += '<tr>' +
            '<td>' + data.id + '</td>' +
            '<td>' + data.name + '</td>' +
            '<td>' + data.lastname + '</td>' +
            '<td>' + data.age + '</td>' +
            '<td>' + data.email + '</td>' +
            '<td>' + tmp_roles + '</td>' +
            '</tr>'

    users_table.innerHTML = tmp_users_table;

    tmp_users_table = "";

}

updateTable();