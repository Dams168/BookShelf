document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit',function (event){
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

function addBook(){
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;
    
    const generatedID = generatedId();
    const bookObject = generateNewBook(generatedID, textTitle, textAuthor, parseInt(textYear), isCompleted);
    books.push(bookObject);
    

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const books = [];
const RENDER_EVENT = 'render-book';

function generatedId(){
    return +new Date();
}

function generateNewBook(id, title,author, year, isCompleted){
    return{
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList =  document.getElementById('incompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    for(const bookItem of books){
        const bookElement = makeBook(bookItem);
        if(!bookItem.isCompleted){
            uncompletedBookList.append(bookElement);
        }else{
            completedBookList.append(bookElement);
        }
    }

  });

function makeBook(bookObject){
    const {id, title, author, year, isCompleted} = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;
    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis : '+ author;
    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun : '+ year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle,textAuthor, textYear);
    container.setAttribute('id', `todo-${id}`);

    const btnaction = document.createElement('div');
    btnaction.classList.add('action');

    if(isCompleted){
        const undoButton =document.createElement('button');
        undoButton.innerText = 'Belum Selesai Dibaca';
        undoButton.classList.add('green');
        undoButton.addEventListener('click', ()=>{
            undoFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.classList.add('red');
        trashButton.addEventListener('click', ()=>{
            removeFromCompleted(id);
        });
        btnaction.append(undoButton, trashButton);
    }else{
        const completeButton = document.createElement('button');
        completeButton.innerText = 'Selesai Dibaca';
        completeButton.classList.add('green');
        completeButton.addEventListener('click', ()=>{
            addToCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.classList.add('red');
        trashButton.addEventListener('click', ()=>{
            removeFromCompleted(id);
        });
        btnaction.append(completeButton, trashButton);
    }
    container.append(btnaction);
    return container;
}

function addToCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null)return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function removeFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);

    if(bookTarget === -1)return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('Anda Telah menghapus Buku Ini');
    saveData();
}

function undoFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null)return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for(const index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
 
function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h3');
    for(book of bookList){
        if (book.innerText.toLowerCase().includes(searchTitle)){
            book.parentElement.style.display ='block';
        }else{
            book.parentElement.style.display ='none';
        } 
    }
    
  });