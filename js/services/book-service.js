'use strict'
const STORAGE_KEY = 'bookDB'
const gTitels = ['Harry Potter', 'Lord Of The Rings', 'Game Of Thrones', 'The Men In The High Castle', 'Mein Kampf']
const PAGE_SIZE = 5

var gPageIdx = 0
var gBooks
var gFilterBy = { title: '', price: 0 }


function getTitels() {
    return gTitels
}

_createBooks()

function getBooks() {

    // Filtering:
    var books = gBooks.filter(book => book.title.includes(gFilterBy.title) &&
        book.price >= gFilterBy.price)

    // Paging:
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function nextPage() {
    if ((gPageIdx + 1) * PAGE_SIZE >= gBooks.length) {
        return
    }
    gPageIdx++

}

function prevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE <= 0) {
        gPageIdx = 0
    }
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(title, price) {
    const book = _createBook(title, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    const currBook = gBooks.find(book => bookId === book.id)
    return currBook
}

function updateBook(bookId, newTitle, newPrice, rating) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    book.title = newTitle
    book.rating = rating
    _saveBooksToStorage()
    return book
}

function _createBook(title, price) {
    return {
        id: makeId(),
        title: title,
        price: price,
        desc: makeLorem(),
        rating: 0
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 13; i++) {
            var title = gTitels[getRandomIntInclusive(0, gTitels.length - 1)]
            var price = getRandomIntInclusive(1, 1000)
            books.push(_createBook(title, price))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}


function setBookFilter(filterBy = {}) {
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
    if (filterBy.price !== undefined) gFilterBy.price = filterBy.price
    return gFilterBy
}


function setBookSort(sortBy = {}) {
    if (sortBy.price !== undefined) {
        gBooks.sort((c1, c2) => (c1.price - c2.price) * sortBy.price)
    } else if (sortBy.title !== undefined) {
        gBooks.sort((c1, c2) => c1.title.localeCompare(c2.title) * sortBy.title)
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}