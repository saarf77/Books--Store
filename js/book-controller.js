'use strict'
const star = "⭐"
const READ_BOOK_ID = "currReadBook"
const UPDATE_BOOK_ID = "currUpdateBook"
const FAV_LAYOUT = "favLayout"
var favState = {cards:"cards",table:"table"}
var massageOptions = {add:`The book has been added`,delete:`The book has been deleted`,update:`The book has been updated`,badSubmit:`Some of the information is missing!!`}
function onInit() {
    var currLayout = loadFromStorage(FAV_LAYOUT)
    if(currLayout !== null && currLayout === "cards")
    {
        document.getElementById("btnradio2").checked = true
    }
    document.getElementById("titleInput").value 
    console.log("active init")
    renderFilterByQueryStringParams()
    renderBooks()
    renderTitelsInFilter()
    var currBook = loadFromStorage(READ_BOOK_ID)
    if(currBook !== null)
    {
        onReadBook(currBook)
    }
}

function renderTitelsInFilter() {

    const titels = getTitels()

    const strHTMLs = titels.map(title => `<option>${title}</option>`)
    strHTMLs.unshift('<option value="">Select Title</option>')

    const elSelect = document.querySelector('.filter-title-select')
    elSelect.innerHTML = strHTMLs.join('')

}


function renderBooks() {
    var currLayout = loadFromStorage(FAV_LAYOUT)
  
    if(currLayout !== null && currLayout === "cards")
    {
        renderBooksCards()
        return
    }
    renderBooksTable()
}
function renderBooksCards()
{
    var books = getBooks()
    var strHtmls = books.map(book => `
        <article class="book-preview">
            <h5>${book.title}</h5>
            <h6>Price: <span>${book.price}</span>$</h6>
            <button type="button" class="btn btn-primary" onclick="onReadBook('${book.id}')">Details</button>
            <button type="button" class="btn btn-warning" onclick="onUpdateBook('${book.id}')">Update</button>
            <button type="button" class="btn btn-danger" class="btn-remove" onclick="onDeleteBook('${book.id}')">Delete</button>
        </article> 
        `
    )
    document.querySelector('.booksContainer').innerHTML = strHtmls.join('')
}
function renderBooksTable()
    {
        var books = getBooks()
        var strHTMLTable =`<table class="table" id="myTable" border="1" cellpadding="10">
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        <tbody class="board"></tbody>
        </table>`
        var elBoard = document.querySelector(".booksContainer")
        elBoard.innerHTML = strHTMLTable
            var strHTML = ``
            for (let i = 0; i < books.length; i++) {
                strHTML += `<tr>`
                for (let j = 0; j < 4; j++) {
                    var currCell
                    switch (j) {
                        case 0:
                            currCell = books[i].id
                            break;
                        case 1:
                            currCell = books[i].title
                            break;
                        case 2:
                            currCell = books[i].price + '$'
                            break;
                        default:
                            break;
                    }
                   if(j<3)
                   {
                    strHTML += `<td class="cell" , event.preventDefault();">${currCell}</td>`
                   }
                  else{
                   strHTML += `<td class="cell" , event.preventDefault();">     
                    <button type="button" class="btn btn-primary" onclick="onReadBook('${books[i].id}')">Details</button>  
                    <button type="button" class="btn btn-warning" onclick="onUpdateBook('${books[i].id}')">Update</button>
                    <button type="button" class="btn btn-danger" class="btn-remove" onclick="onDeleteBook('${books[i].id}')">Delete</button>
                    </td>`
                  }
                }
                strHTML += `</tr>`
            }
            elBoard = document.querySelector(".board")
            elBoard.innerHTML = strHTML
    }
function onDeleteBook(bookId) {
    removeBook(bookId)
    flashMsg(massageOptions.delete)
    renderBooks()
}

function onAddBook() {
    var elModal = document.querySelector('.modalAddBook')
    elModal.classList.add('open')
}

function onUpdateBook(bookId) {
    saveToStorage(UPDATE_BOOK_ID,bookId)
    var elModal = document.querySelector('.modalUpdateBook')
    elModal.classList.add('open')
    const book = getBookById(bookId)
    document.getElementById("titleUpdateInput").value = book.title
    document.getElementById("priceUpdateInput").value = book.price
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('p').innerText = book.desc
    elModal.classList.add('open')
    var strHTML = `<button onclick="onSubRating('${book.id}')">-</button><span> ${book.rating} </span><button onclick="onAddRating('${book.id}')">+</button>`
    var elRating = document.querySelector(".rating")
    elRating.innerHTML = strHTML
    saveToStorage(READ_BOOK_ID,bookId)
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?title=${filterBy.title}&price=${filterBy.price}&rating=${filterBy.rating}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}


function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
    saveToStorage(READ_BOOK_ID,null)
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        title: queryStringParams.get('title') || '',
        price: +queryStringParams.get('price') || 0,
        rating: +queryStringParams.get('rating') || 0
    }

    if (!filterBy.title && !filterBy.price && !filterBy.rating) return

    document.querySelector('.filter-title-select').value = filterBy.title
    document.querySelector('.filter-price-range').value = filterBy.price
    document.querySelector('.filter-rating-range').value = filterBy.rating
    setBookFilter(filterBy)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked

    // const sortBy = {}
    // sortBy[prop] = (isDesc)? -1 : 1

    // Shorter Syntax:
    const sortBy = {
        [prop]: (isDesc) ? -1 : 1
    }

    setBookSort(sortBy)
    renderBooks()
}


function onNextPage() {
    nextPage()
    renderBooks()
}

function onPrevPage() {
    prevPage()
    renderBooks()
}

function onSubRating(bookId) {
    var book = getBookById(bookId)
    if ( book.rating == 0) {
        return
    }

    book = updateBook(bookId,book.title ,book.price,book.rating-1)
    onReadBook(bookId)
}

function onAddRating(bookId) {
    var book = getBookById(bookId)
    if ( book.rating == 10) {
        return
    }
    book = updateBook(bookId,book.title ,book.price,book.rating+1)
    onReadBook(bookId)
}
function onCloseAddModal()
{
    document.getElementById("titleInput").value =''
    document.getElementById("priceInput").value =''
    document.querySelector('.modalAddBook').classList.remove('open')
}
function onSubmitAddModal()
{
    var bookTitle = document.getElementById("titleInput").value 
    var bookPrice = document.getElementById("priceInput").value 
    if (!bookTitle || !bookPrice) {
        flashMsg(massageOptions.badSubmit)
        return
    }
    document.getElementById("titleInput").value =''
    document.getElementById("priceInput").value =''
    addBook(bookTitle,bookPrice)  
    document.querySelector('.modalAddBook').classList.remove('open')
    flashMsg(massageOptions.add)
    renderBooks()
}
function onCloseUpdateModal()
{
    document.querySelector('.modalUpdateBook').classList.remove('open')
}
function onSubmitUpdateModal()
{
    var currBook = loadFromStorage(UPDATE_BOOK_ID)
    const book = getBookById(currBook)
    var newTitle = document.getElementById("titleUpdateInput").value 
    var newPrice = document.getElementById("priceUpdateInput").value 
    if( !newPrice || !newTitle ) 
    {
        flashMsg(massageOptions.badSubmit)
        return
    }
    if (book.price !== newPrice || book.title !== newTitle ){
        updateBook(book.id,newTitle ,newPrice,book.rating)
        flashMsg(massageOptions.update)
        renderBooks()
    }
    document.querySelector('.modalUpdateBook').classList.remove('open')

}
function onClickTable()
{
    saveToStorage(FAV_LAYOUT,favState.table)
    renderBooks()
}
function onClickCards()
{
    saveToStorage(FAV_LAYOUT,favState.cards)
    renderBooks()
}
