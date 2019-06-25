const todoSection = document.querySelector('#todo-section');
const inputTitle = document.querySelector('#registration-title');
const inputPost = document.querySelector('#registration-info');
const inputImp = document.querySelector('#importance');
const submitRegistration = document.querySelector('#registration-button');
const submitForm = document.querySelector('#formdata');
const sortButtons = document.querySelectorAll('.submit-button');
let state = localStorage.getItem('todoList');

state = state ? JSON.parse(state) : [];

function setLocal() {
  localStorage.setItem('todoList', JSON.stringify(state));
  appendData(state);
}

function toggleDone(id) {
  const doneItem = state.splice(state.findIndex(post => post.id === parseInt(id, 10)), 1)[0];
  doneItem.done = !doneItem.done;
  doneItem.done ? state.push(doneItem) : state.unshift(doneItem);
  setLocal(state);
}

function removeTodo(id) {
  state = state.filter((post) => {
    if (parseInt(id, 10) === post.id) return false;
    return true;
  });
  setLocal();
}

function addListener() {
  const todoDivs = document.querySelectorAll('.todo-container');
  const removeButtons = document.querySelectorAll('.remove-button');
  todoDivs.forEach((currentDiv) => {
    currentDiv.addEventListener('click', () => {
      toggleDone(currentDiv.id);
    });
  });
  removeButtons.forEach((rmButton) => {
    rmButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const { id } = rmButton.closest('.todo-container');
      removeTodo(id);
    });
  });
}

function appendData() {
  let htmlContent = '';
  state.forEach((todo) => {
    const doneClass = todo.done ? 'done' : '';
    htmlContent += `<div class="todo-container ${doneClass}" id="${todo.id}">
    <h2>${todo.title} </h2>
    <p>${todo.post}</p>
    <div class="todo-info">
    <p class="importance">Importance: ${todo.importance}</p>
    <p class="timestamp">${todo.timestamp}</p>
    <button class="remove-button">Remove ToDo</button>
    </div>
    </div>`;
  });
  todoSection.innerHTML = htmlContent;
  addListener();
}

function sortItems(sortOrder) {
  function compare(a, b) {
    let sortWay;
    let order1;
    let order2;
    if (sortOrder === 'old' || sortOrder === 'new') sortWay = 'timestamp';
    if (sortOrder === 'easy' || sortOrder === 'urgent') sortWay = 'importance';
    if (sortOrder === 'old' || sortOrder === 'easy') {
      order1 = -1;
      order2 = 1;
    }
    if (sortOrder === 'new' || sortOrder === 'urgent') {
      order1 = 1;
      order2 = -1;
    }
    if (a[sortWay] > b[sortWay]) return order1;
    if (a[sortWay] < b[sortWay]) return order2;
    return 0;
  }
  function doneItems(a) {
    if (!a.done) {
      return -1;
    }
    return 0;
  }
  state.sort(compare)
    .sort(doneItems);
  setLocal();
}

function newTodo(todoitem) {
  const time = new Date()
    .toISOString()
    .replace('T', ' ')
    .split('.')
    .slice()[0];
  const id = Date.now();
  const newItem = {
    title: todoitem.title,
    post: todoitem.post,
    importance: todoitem.importance,
    timestamp: time,
    id,
    done: false,
  };
  state.unshift(newItem);
  setLocal();
}

submitRegistration.onclick = (e) => {
  if (inputTitle.value && inputPost.value) {
    const title = inputTitle.value;
    const post = inputPost.value;
    const importance = inputImp.value;
    e.preventDefault();
    submitForm.reset();
    newTodo({ title, post, importance });
  }
};

sortButtons.forEach((sortButton) => {
  sortButton.addEventListener('click', () => {
    sortItems(sortButton.id);
  });
});

window.onload = () => {
  appendData(JSON.parse(localStorage.getItem('todoList')));
};