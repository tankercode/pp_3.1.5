// заполняем navbar
const REST_AUT_USER = "http://localhost:8081/api/AuthenticatedUser";

const navbarEmail = document.getElementById('navbar-email');
const navbarRoles = document.getElementById('navbar-roles');

fetch(REST_AUT_USER)
    .then(response => response.json())
    .then(data => {
        navbarEmail.innerText = data.email;

        let roles = "";
        data.role.forEach((role) => roles += role.type + " ");

        navbarRoles.innerText = roles;

    })

// делаем nav-tabs кликабельными
const nav_Item_New_User = document.getElementById('nav-item-new-user');
const nav_Item_All_Users = document.getElementById('nav-item-all-users');

const tab_All_Users = document.getElementById('tab-all-users');
const tab_New_User = document.getElementById('tab-add-user');

nav_Item_All_Users.addEventListener('click', () => {

    nav_Item_All_Users.classList.add("active");
    nav_Item_New_User.classList.remove("active");

    tab_All_Users.classList.add("active");
    tab_New_User.classList.remove("active");

    updateTable();
})
nav_Item_New_User.addEventListener('click', () => {

    nav_Item_All_Users.classList.remove("active");
    nav_Item_New_User.classList.add("active");

    tab_New_User.classList.add("active");
    tab_All_Users.classList.remove("active");

    showCardNewUser();
})

// получаем все роли

const URL_ROLE = "http://localhost:8081/api/Roles";
const getRoles = async () => {
    return await fetch(URL_ROLE, {method: 'GET'})
        .then(response => response.json())
}
const all_roles_result = getRoles();


// заполняем таблицу пользователями
const REST_USERS = "http://localhost:8081/api/Users";
const users_table = document.getElementById("Users-table-body");

let tmp_users_table = "";

const updateTable = () => {
    fetch(REST_USERS)
        .then(response => response.json())
        .then(data => showUsers(data))
}

// шаблон таблицы
const showUsers = (data) => {

    users_table.innerHTML = "";

    let tmp_roles = "";
    data.forEach((user) => {
        // получаем роли пользователя
        user.role.forEach((role) => tmp_roles += role.type + " ");

        // заполняем таблицу шаблоном
        tmp_users_table += '<tr>' +
            '<td>' + user.id + '</td>' +
            '<td>' + user.name + '</td>' +
            '<td>' + user.lastname + '</td>' +
            '<td>' + user.age + '</td>' +
            '<td>' + user.email + '</td>' +
            '<td>' + tmp_roles + '</td>' +
            '<td class="text text-white"><a class="btnEdit btn btn-info">Edit</a></td>' +
            '<td class="text text-white"><a class="btnDelete btn btn-danger">Delete</a></td>' +
            '</tr>'

        tmp_roles = ""
    });

    users_table.innerHTML = tmp_users_table;

    tmp_users_table = "";

}

updateTable();

// модальное окно редактирования
const URL_USER = "http://localhost:8081/api/Users/";
const URL_UPDATE_USER = "http://localhost:8081/api/Users";

const modal_edit = new bootstrap.Modal(document.getElementById('modal-edit'));
const modal_edit_form = document.getElementById('modal-edit');
const edit_Id = document.getElementById('modal-edit-id');
const edit_Name = document.getElementById('modal-edit-name');
const edit_Lastname = document.getElementById('modal-edit-lastname');
const edit_Email = document.getElementById('modal-edit-email');
const edit_Age = document.getElementById('modal-edit-age');
const edit_Password = document.getElementById('modal-edit-password');
const edit_Roles = document.getElementById('modal-edit-roles');

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

let formId = 0
on(document, 'click', '.btnEdit', async e => {

    // id пользователя, на форме которого находится кнопка
    formId = e.target.parentNode.parentNode.firstElementChild.innerHTML

    // вызываем форму, заполненную редактируемым пользователем
    fetch(URL_USER + formId, {method: 'GET'})
        .then(response => response.json())
        .then(data => getUserById(data))

    const getUserById = (user) => {

        edit_Id.value = user.id;
        edit_Name.value = user.name;
        edit_Lastname.value = user.lastname;
        edit_Age.value = user.age;
        edit_Email.value = user.email;
        edit_Password.value = user.password;
        all_roles_result.then(
            (data) => {
                //чистим список
                edit_Roles.options.length = 0;

                // заполняем список
                for (const role of data) {
                    let element = document.createElement('option');
                    element.value = role.id;
                    element.text = role.type;
                    edit_Roles.appendChild(element);
                }
            }
        )

        modal_edit.show();
    }
})

let change_result_edit = []
function changeOptionEdit() {
    change_result_edit = [];

    for (const o of edit_Roles.selectedOptions) {
        change_result_edit.push({
            id: o.value,
            type: o.text
        })
    }

}

edit_Roles.addEventListener("change", changeOptionEdit);
modal_edit_form.addEventListener('submit', (event) => {
    event.preventDefault()

    fetch(URL_UPDATE_USER, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            id: formId,
            name: edit_Name.value,
            lastname: edit_Lastname.value,
            age: edit_Age.value,
            email: edit_Email.value,
            password: edit_Password.value,
            role: change_result_edit
        })
    })
        .then(res => res.json())
        .then(updateTable)

    modal_edit.hide()
})

// модальное окно удаления
const URL_DELETE = "http://localhost:8081/api/Users/";

const modal_delete = new bootstrap.Modal(document.getElementById('modal-delete'));
const modal_delete_form = document.getElementById('modal-delete');

const delete_Id = document.getElementById('modal-delete-id');
const delete_Name = document.getElementById('modal-delete-name');
const delete_Lastname = document.getElementById('modal-delete-lastname');
const delete_Age = document.getElementById('modal-delete-age');
const delete_Email = document.getElementById('modal-delete-email');
const delete_Roles = document.getElementById('modal-delete-roles');

on(document, 'click', '.btnDelete', e => {

    // id пользователя, на форме которого находится кнопка
    formId = e.target.parentNode.parentNode.firstElementChild.innerHTML

    fetch(URL_USER + formId, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(data => getUserById(data))

    const getUserById = (user) => {
        delete_Id.value = user.id;
        delete_Name.value = user.name;
        delete_Lastname.value = user.lastname;
        delete_Age.value = user.age;
        delete_Email.value = user.email;

        delete_Roles.options.length = 0;

        for (const role of user.role) {
            let option = document.createElement('option');
            option.value = role.type;
            option.innerHTML = role.type;
            delete_Roles.appendChild(option);
        }

        modal_delete.show();
    }
})

modal_delete_form.addEventListener('submit', event => {
    event.preventDefault()

    fetch(URL_DELETE + formId, {
        method: 'DELETE'
    })
        .then(updateTable)
    modal_delete.hide()
})


//добавление user
const URL_CREATE = "http://localhost:8081/api/Users";

const form_New_User = document.getElementById('form-new-user');
const card_New_User_Name = document.getElementById('card-new-user-name');
const card_New_User_Lastname = document.getElementById('card-new-user-Lastname');
const card_New_User_Email = document.getElementById('card-new-user-Email');
const card_New_User_Age = document.getElementById('card-new-user-Age');
const card_New_User_Password = document.getElementById('card-new-user-Password');
const card_New_User_Roles = document.getElementById('card-new-user-roles');

const showCardNewUser = async () => {

    card_New_User_Name.value = '';
    card_New_User_Lastname.value = '';
    card_New_User_Age.value = '';
    card_New_User_Email.value = '';
    card_New_User_Password.value = '';
    all_roles_result.then(
        (data) => {
            //чистим список
            card_New_User_Roles.options.length = 0;

            // заполняем список
            for (const role of data) {
                let element = document.createElement('option');
                element.value = role.id;
                element.text = role.type;
                card_New_User_Roles.appendChild(element);
            }
        }
    )
}

let change_result_new = []
function changeOptionNew() {
    change_result_new = [];

    for (const o of card_New_User_Roles.selectedOptions) {
        change_result_new.push({
            id: o.value,
            type: o.text
        })
    }
}

card_New_User_Roles.addEventListener("change", changeOptionNew);

form_New_User.addEventListener("submit", event => {
    event.preventDefault();

    fetch(URL_CREATE, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            name: card_New_User_Name.value,
            lastname: card_New_User_Lastname.value,
            email: card_New_User_Email.value,
            age: card_New_User_Age.value,
            password: card_New_User_Password.value,
            role: change_result_new
        })
    })
        .then(res => res.json())
        .then(updateTable)

    nav_Item_All_Users.click();
})







