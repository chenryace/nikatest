// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDbVooTJqSk0uoFJnuS0kq8TyMWKXHeygEy",
    authDomain: "https://nika-7a413.firebaseapp.com",
    projectId: "nika-7a413",
    storageBucket: "nika-7a413.appspot.com",
    messagingSenderId: "1011317445864",
    appId: "1:1011317445864:web:836ac64bfe7f4fb403655d"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);
const auth = firebase.auth(app);

// Function to write data to Firebase
function writeToFirebase(data) {
    db.ref('todos').push(data)
        .then(() => {
            console.log('Data added successfully');
        })
        .catch((error) => {
            console.error('Error adding data: ', error);
        });
}

// Function to read data from Firebase and render it in the UI
function renderTodos() {
    const todoList = document.getElementById('todo-tasks');
    todoList.innerHTML = ''; // Clear existing list items

    db.ref('todos').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const todo = childSnapshot.val();
            const li = createTodoElement(childSnapshot.key, todo);
            todoList.appendChild(li);
        });
    });
}

// Function to create a todo list item element
function createTodoElement(key, todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.key = key;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        updateTodo(key, todo);
    });

    const title = document.createElement('div');
    title.textContent = todo.title;
    title.className = 'todo-item-title';
    title.contentEditable = true;
    title.addEventListener('blur', () => {
        todo.title = title.textContent;
        updateTodo(key, todo);
    });

    const content = document.createElement('div');
    content.textContent = todo.content;
    content.className = 'todo-item-content';
    content.contentEditable = true;
    content.addEventListener('blur', () => {
        todo.content = content.textContent;
        updateTodo(key, todo);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.addEventListener('click', () => {
        deleteTodo(key);
    });

    li.append(checkbox, title, content, deleteButton);
    return li;
}

// Function to update a todo item in Firebase
function updateTodo(key, todo) {
    db.ref('todos/' + key).update(todo)
        .then(() => {
            console.log('Todo updated successfully');
        })
        .catch((error) => {
            console.error('Error updating todo: ', error);
        });
}

// Function to delete a todo item from Firebase
function deleteTodo(key) {
    db.ref('todos/' + key).remove()
        .then(() => {
            console.log('Todo deleted successfully');
        })
        .catch((error) => {
            console.error('Error deleting todo: ', error);
        });
}

// Event listener for adding a new todo
document.getElementById('add-button').addEventListener('click', () => {
    const title = document.getElementById('todo-title-input').value.trim();
    const content = document.getElementById('todo-content-input').value.trim();

    if (title === '' || content === '') {
        alert('任务标题和内容不能为空');
        return;
    }

    const newTodo = {
        title: title,
        content: content,
        completed: false
    };

    writeToFirebase(newTodo);
});

// Event listener for clearing selected todos
document.getElementById('clear-selected-button').addEventListener('click', () => {
    const todoItems = document.querySelectorAll('.todo-item');
    todoItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            const key = item.dataset.key;
            deleteTodo(key);
        }
    });
});

// Initialize rendering when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
});
