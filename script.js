const todoTitleInput = document.getElementById('todo-title-input');
const todoContentInput = document.getElementById('todo-content-input');
const highPriorityButton = document.getElementById('high-priority-button');
const addButton = document.getElementById('add-button');
const selectAllButton = document.getElementById('select-all-button');
const clearSelectedButton = document.getElementById('clear-selected-button');
const todoList = document.querySelector('#todo-list .task-list');
const inProgressList = document.querySelector('#in-progress-list .task-list');
const completedList = document.querySelector('#completed-list .task-list');

let todos = [];

// 获取 Firebase 数据
const todosRef = db.ref('todos');

// 监听 Firebase 数据变化
todosRef.on('value', (snapshot) => {
  todos = snapshot.val() || [];
  renderTodos();
});

let highPriority = false;
let draggedItem = null;

highPriorityButton.addEventListener('click', () => {
  highPriority = !highPriority;
  highPriorityButton.style.backgroundColor = highPriority ? '#f44336' : '#4CAF50';
});

function saveTodos() {
  todosRef.set(todos); // 保存到 Firebase 数据库
}

function createTodoElement(todo, index) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.draggable = true;
  li.dataset.index = index;

  li.addEventListener('dragstart', () => {
    draggedItem = li;
    setTimeout(() => {
      li.style.display = 'none';
    }, 0);
  });

  li.addEventListener('dragend', () => {
    setTimeout(() => {
      draggedItem.style.display = 'block';
      draggedItem = null;
      saveTodos();
    }, 0);
  });

  li.addEventListener('dragover', e => {
    e.preventDefault();
    if (li !== draggedItem) {
      const allItems = Array.from(li.parentNode.querySelectorAll('.todo-item'));
      const currentPos = allItems.indexOf(draggedItem);
      const newPos = allItems.indexOf(li);

      if (currentPos < newPos) {
        li.parentNode.insertBefore(draggedItem, li.nextSibling);
      } else {
        li.parentNode.insertBefore(draggedItem, li);
      }
    }
  });

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked;
    saveTodos();
    renderTodos();
  });

  const title = document.createElement('div');
  title.textContent = todo.title;
  title.className = 'todo-item-title';
  if (todo.priority === 'high') title.classList.add('high-priority');
  title.contentEditable = true;
  title.addEventListener('blur', () => {
    todo.title = title.textContent;
    saveTodos();
  });

  const content = document.createElement('div');
  content.textContent = todo.content;
  content.className = 'todo-item-content';
  if (todo.completed) content.classList.add('completed');
  content.contentEditable = true;
  content.addEventListener('blur', () => {
    todo.content = content.textContent;
    saveTodos();
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '删除';
  deleteButton.addEventListener('click', () => {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  });

  const highButton = document.createElement('button');
  highButton.textContent = '高优先级';
  highButton.addEventListener('click', () => {
    todo.priority = todo.priority === 'high' ? 'normal' : 'high';
    saveTodos();
    renderTodos();
  });

  li.append(checkbox, title, content, highButton, deleteButton);

  return li;
}

function renderTodos() {
  todoList.innerHTML = '';
  inProgressList.innerHTML = '';
  completedList.innerHTML = '';

  todos.forEach((todo, index) => {
    const todoElement = createTodoElement(todo, index);
    if (!todo.completed && !todo.inProgress) {
      todoList.appendChild(todoElement);
    } else if (!todo.completed && todo.inProgress) {
      inProgressList.appendChild(todoElement);
    } else {
      completedList.appendChild(todoElement);
    }
  });
}

addButton.addEventListener('click', () => {
  const title = todoTitleInput.value.trim();
  const content = todoContentInput.value.trim();

  if (title === '' || content === '') {
    alert('任务标题和内容不能为空');
    return;
  }

  const todo = {
    title,
    content,
    completed: false,
    priority: highPriority ? 'high' : 'normal',
    inProgress: false
  };
  todos.push(todo);
  saveTodos();
  todoTitleInput.value = '';
  todoContentInput.value = '';
  highPriority = false;
  highPriorityButton.style.backgroundColor = '';
  renderTodos();
});

selectAllButton.addEventListener('click', () => {
  todos.forEach(todo => {
    todo.completed = true;
  });
  saveTodos();
  renderTodos();
});

clearSelectedButton.addEventListener('click', () => {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
});

document.querySelectorAll('.dropzone').forEach(dropzone => {
  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.style.backgroundColor = '#e0e0e0';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.backgroundColor = '';
  });

  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.style.backgroundColor = '';
    const index = draggedItem.dataset.index;
    todos[index].inProgress = dropzone.id === 'in-progress-list';
    todos[index].completed = dropzone.id === 'completed-list';
    saveTodos();
    renderTodos();
  });
});

renderTodos();
</script>
