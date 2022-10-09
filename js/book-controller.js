'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    renderTitelsInFilter()
}

function renderTitelsInFilter() {

    const titels = getTitels()

    const strHTMLs = titels.map(title => `<option>${title}</option>`)
    strHTMLs.unshift('<option value="">Select Title</option>')

    const elSelect = document.querySelector('.filter-title-select')
    elSelect.innerHTML = strHTMLs.join('')

}


function renderBooks() {
    var books = getBooks()
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
            if (j < 3) {
                strHTML += `<td class="cell" , event.preventDefault();">${currCell}</td>`
            }
            else {
                strHTML += `<td class="cell" , event.preventDefault();">     
                <button onclick="onReadBook('${books[i].id}')">Details</button>  
                <button onclick="onUpdateBook('${books[i].id}')">Update</button>
                <button class="btn-remove" onclick="onDeleteBook('${books[i].id}')">Delete</button>
                </td>`

            }


        }
        strHTML += `</tr>`
    }
    var elBoard = document.querySelector(".board")
    elBoard.innerHTML = strHTML


    // var strHtmls = cars.map(car => `
    //     <article class="car-preview">
    //         <button class="btn-remove" onclick="onDeleteCar('${car.id}')">X</button>
    //         <h5>${car.vendor}</h5>
    //         <h6>Up to <span>${car.maxSpeed}</span> KMH</h6>
    //         <button onclick="onReadCar('${car.id}')">Details</button>
    //         <button onclick="onUpdateCar('${car.id}')">Update</button>
    //         <img onerror="this.src='img/fiat.png'" src="img/${car.vendor}.png" alt="Car by ${car.vendor}">
    //     </article> 
    //     `
    // )
    // document.querySelector('.cars-container').innerHTML = strHtmls.join('')
}

function onDeleteBook(bookId) {
    removeBook(bookId)
    renderBooks()
    flashMsg(`Book Deleted`)
}

function onAddBook() {
    var title = prompt('book Title?', 'Harry Potter')
    var price = prompt('book Price?', 19.9)
    if (title && price) {
        const book = addBook(title, price)
        renderBooks()
        flashMsg(`Book Added (id: ${book.id})`)
    }
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +prompt('Price?', book.price)
    var newTitle = prompt('Title?', book.title)
    if ((newPrice && newTitle) && (book.price !== newPrice || book.title !== newTitle)) {
        const book = updateBook(bookId, newTitle, newPrice, book.rating)
        renderBooks()
        flashMsg(`Title updated to: ${book.title} and price updated to: ${book.price}`)
    }
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('h4 span').innerText = ' ' + book.price
    elModal.querySelector('p').innerText = book.desc
    elModal.classList.add('open')
    var strHTML = `<button onclick="onSubRating('${book.id}')">-</button><span>${book.rating}</span><button onclick="onAddRating('${book.id}')">+</button> `
    var elRating = document.querySelector(".rating")
    elRating.innerHTML = strHTML
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?title=${filterBy.title}&price=${filterBy.price}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}


function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
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
        price: +queryStringParams.get('price') || 0
    }

    if (!filterBy.title && !filterBy.price) return

    document.querySelector('.filter-title-select').value = filterBy.title
    document.querySelector('.filter-price-range').value = filterBy.price
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
    if (book.rating == 0) {
        return
    }
    book = updateBook(bookId, book.title, book.price, book.rating - 1)
    onReadBook(bookId)
}

function onAddRating(bookId) {
    var book = getBookById(bookId)
    if (book.rating == 10) {
        return
    }
    book = updateBook(bookId, book.title, book.price, book.rating + 1)
    onReadBook(bookId)
}



