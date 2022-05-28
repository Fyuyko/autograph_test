// для всех запросов
const request = async (url, method = 'GET', body = null, headers = {
   'Content-type': 'application/json; charset=UTF-8',
}) => {

   try {
      const response = await fetch(url, {
         method,
         body,
         headers
      });

      if (!response.ok) {
         throw new Error(`Could not fetch ${url}, status: ${response.status}`);
      }

      const data = await response.json();

      return data;
   } catch (e) {
      throw e;
   }

};

/*--------------- ToDo -----------------*/

let todoParrent = document.querySelector('.todo'),
   form = document.querySelector('.add-todo'),
   input = document.querySelector('.add-todo__import'),
   button = document.querySelector('.add-todo__button');

// создание и добавление элементов на странцу
const createTodo = (data) => {

   const itemTodoArr = JSON.parse(localStorage.getItem('todo')) ? JSON.parse(localStorage.getItem('todo')) : [];

   let aboutObj = {};

   const create = (id, title, completed) => {
      const li = document.createElement('li');
      li.classList.add('todo__item', 'show');
      if (completed) {
         li.classList.add('checked');
      }
      li.id = id;
      // checkbox и title
      const checkboxWrapper = document.createElement('div');
      checkboxWrapper.classList.add('checkbox-wrapper');
      if (completed) {
         checkboxWrapper.innerHTML = (`<input id=${id} type="checkbox" class="checkbox" id="checkbox${id}" checked> <label for="checkbox${id}">${title}</label>`);
      } else {
         checkboxWrapper.innerHTML = (`<input id=${id} type="checkbox" class="checkbox" id="checkbox${id}"> <label for="checkbox${id}">${title}</label>`);
      }
      //divRemove
      const removeButton = document.createElement('button');
      removeButton.classList.add('todo__item-remov');
      removeButton.innerHTML = ('<img src="./img/remove.svg">');
      removeButton.id = id;
      //add elements to li
      li.appendChild(checkboxWrapper);
      li.appendChild(removeButton);
      todoParrent.appendChild(li);

      aboutObj = {
         id,
         title,
         completed,
      };
   };

   if (typeof data === 'object') {
      return (data.map(item => {
         let title = item.title,
            id = item.id,
            completed = item.completed;
         create(id, title, completed);
         return item;
      }));
   } else {
      let id = Math.floor(Math.random() * (1000 - 5 + 1)) + 5,
         title = data,
         completed = false;
      create(id, title, completed);
   }

   itemTodoArr.push(aboutObj);
   localStorage.setItem('todo', JSON.stringify(itemTodoArr));

   checkedTodo();
   deleteTodo();
   sortTodo();
};
// добавление элементов через input
const createUserTodo = () => {
   form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (input.value.length > 0) {
         createTodo(input.value);
      }
      input.value = '';
   });
};
createUserTodo();
// добавление эл-тов из LocalStorage
const createLocalStorageTodo = () => {
   const data = JSON.parse(localStorage.getItem('todo'));
   if (data) {
      createTodo(data);
   }
};
createLocalStorageTodo();
// удаление элементов
const deleteTodo = () => {

   let todoItems = document.querySelectorAll('.todo__item'),
      removeButtons = document.querySelectorAll('.todo__item-remov');
   for (let button of removeButtons) {
      button.addEventListener('click', () => {
         todoItems.forEach(item => {
            if (button.id == item.id) {
               item.remove();
            }
         });

         let aboutArr = JSON.parse(localStorage.getItem(`todo`));
         if (aboutArr) {
            aboutArr.forEach(item => {
               if (item.id == button.id) {
                  let index = aboutArr.indexOf(item);
                  return aboutArr.splice(index, 1);
               }
            });
         }
         localStorage.setItem(`todo`, JSON.stringify(aboutArr));
      });
   }
};
// отметка checked
const checkedTodo = () => {
   let todoItems = [...document.querySelectorAll('.todo__item')];
   let checkbox = [...document.querySelectorAll('.checkbox')];

   todoItems.forEach(todo => {
      todo.addEventListener('click', () => {
         todo.classList.toggle("checked");
         checkbox.forEach(box => {
            if (box.id === todo.id) {
               box.toggleAttribute("checked");
            }
         });

         let aboutArr = JSON.parse(localStorage.getItem(`todo`));
         if (aboutArr) {
            aboutArr.map(item => {
               if (todo.id == item.id) {
                  item.completed = !item.completed;
               }
            });
            localStorage.setItem(`todo`, JSON.stringify(aboutArr));
         }
      });
   });
};


/*--------------------- Sorting------------------------- */

const sortingVariants = [{
   title: 'Все',
   id: "all"
}, {
   title: "Выполненные",
   id: "made"
}, {
   title: "В работе",
   id: "in-work"
}];

let checkMark = document.createElement('img');
let sortList = document.querySelector('.sorting__list');

checkMark.setAttribute("src", "./img/check-mark.svg");
// создание элементов сортировки
sortingVariants.forEach(item => {
   const div = document.createElement('div');
   div.classList.add('sorting__item');
   div.innerHTML = item.title;
   div.id = item.id;
   if (div.id == "all") {
      div.classList.add('active');
      div.appendChild(checkMark);
   }
   sortList.appendChild(div);
});
// открытие/закрытие меню сортировки
const openSortListButton = document.querySelector('.sorting__open-button');
const sortListHeader = document.querySelector('.sorting__header');

const toggleSortMenu = () => {
   openSortListButton.classList.toggle('active');
   sortList.classList.toggle('show-menu');
};
sortListHeader.addEventListener('click', () => {
   toggleSortMenu();
});
//активный фильтр (class='active')
let activeFilterTitle = document.querySelector('.sorting__active-filter');
const activeFilter = () => {
   let sortItem = document.querySelectorAll('.sorting__item');

   sortList.addEventListener('click', (event) => {
      let target = event.target;
      for (let i = 0; i < sortItem.length; i++) {
         sortItem[i].classList.remove('active');
      }

      activeFilterTitle.innerHTML = target.firstChild.data;
      target.classList.add('active');
      target.appendChild(checkMark);
   });
};
activeFilter();
// сам фильтр
const sortTodo = () => {
   const todos = document.querySelectorAll('.todo__item');
   const sortItems = document.querySelectorAll('.sorting__item');

   sortItems.forEach(sort => {
      sort.addEventListener('click', () => {
         if (sort.id == 'all') {
            for (let todo of todos) {
               todo.classList.add('show');
            }
         }
         if (sort.id == 'made') {
            for (let todo of todos) {
               if (!todo.classList.contains('checked')) {
                  todo.classList.remove('show');
               } else {
                  todo.classList.add('show');
               }
            }
         }
         if (sort.id == 'in-work') {
            for (let todo of todos) {
               if (todo.classList.contains('checked')) {
                  todo.classList.remove('show');
               } else {
                  todo.classList.add('show');
               }
            }
         }
      });

   });

};

/*------------------------ popup -----------------------------*/

const popupWrapper = document.querySelector('.user__popap-wrapper'),
   popup = document.querySelector('.user__popap'),
   popupOpenButton = document.querySelector('.logo__popup-open-button'),
   popupCloseButton = document.querySelector('.user__close-button');

popupOpenButton.addEventListener('click', () => {
   popupWrapper.classList.add('active');
   popup.classList.add('active');
});
const closePopup = () => {
   popupWrapper.classList.remove('active');
   popup.classList.remove('active');
};
popupCloseButton.addEventListener('click', () => {
   closePopup();
});
document.addEventListener('keydown', function (e) {
   if (e.key === 'Escape') {
      closePopup();
   }
});
document.addEventListener('click', function (e) {
   if (e.target == popupWrapper) {
      closePopup();
   }
});


/*----------------------- Get data -----------------------*/

const receivingToDo = () => {
   request('https://jsonplaceholder.typicode.com/todos?_page=1&_limit=5', 'GET')
      .then(data => {
         createTodo(data);
         checkedTodo();
         deleteTodo();
         sortTodo();
      });
};

receivingToDo();