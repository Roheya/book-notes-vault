import { fromStorage } from "./storage.js"
import { save_to_storage } from "./storage.js";


export let books = fromStorage()
export function getBooks(){
    return books
}

function generateUniqueId(){
    const highestNum = books.reduce((max, item) =>{
        const match = item.id ? item.id.match(/^rec_(\d+)$/) : null
        return match ? Math.max(max, parseInt(match[1], 10)) : max
    }, 0)
    return `rec_${String(highestNum + 1).padStart(4, '0') }`
}

export function record(formdata){
    const now = new Date().toISOString();
    return {
        id : generateUniqueId(),
        title: formdata.title,
        author : formdata.author,
        pages : Number(formdata.pages),
        read : Number(formdata.read),
        tag : formdata.tag,
        date : formdata.date,
        createdAt: now,
        updatedAt: now
    }
}



export function addBook(formdata){
    let newBook = record(formdata)
    books.push(newBook)
    save_to_storage(books)
    return newBook
}

export function deleteBook(index){
    books.splice(index, 1)
    save_to_storage(books)
}


export function updateBook(index, updateData){
    const now = new Date().toISOString()
    books[index] = {
        ...books[index],
        ...updateData,
        updatedAt: now
    }
    save_to_storage(books)
}
export function BooksState(newBooks){
    books = newBooks
    save_to_storage(books)
}

export const setBooks = BooksState