import { fromStorage , save_to_storage} from "./storage.js";
import { deleteBook, getBooks, setBooks, updateBook } from "./state.js";
import { addBook } from "./state.js";
import { exportToJSON } from "./importExport.js";
import { importFromJSON } from "./importExport.js";
import { sortRecords, filterRecordsByRegex, markMatch } from './search.js';
import { validateFormInput } from "./validator.js";
import { calculateDashboardStats } from "./stats.js";

const bookForm = document.getElementById("book-form")
const tableBody = document.getElementById("tableBody")
const tbooks = document.getElementById("tbooks")
const tprogress = document.getElementById("tprogress")
const exportBtn = document.getElementById("export-btn")
const importInput = document.getElementById("import-file-input")
const searchInput = document.getElementById("search-input")

let currentSortField = null
let currentSortAscending = true

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}
function renderApp(searchQuery = "") {
    const currentBooks = getBooks()
    const stats = calculateDashboardStats(currentBooks, 500)
    if(tbooks) tbooks.textContent = stats.totalRecords
    if (tprogress) tprogress.textContent = stats.totalPagesRead

    const hoursEl = document.getElementById("t-hours")
    if (hoursEl) hoursEl.textContent = stats.estimatedHours
    
    const TopTagEl = document.getElementById("stat-top-tag")
    if (TopTagEl) TopTagEl.textContent = stats.topCategory
    
    const liveRegion = document.getElementById("cap-live-region")
    const capMessageEl = document.getElementById("cap-display-message")
    if (liveRegion && capMessageEl){
        liveRegion.setAttribute("aria-live", stats.ariaLiveType)
        liveRegion.textContent = stats.capMessage
        capMessageEl.textContent = stats.capMessage
    }


    const chartContainer = document.getElementById("trend-chart")
    if (chartContainer){
        chartContainer.innerHTML = ""
        Object.entries(stats.last7DaysData).forEach(([date, count])=>{
            const bar = document.createElement("div")
            bar.className = "trend-bar"
            bar.style.height = `${Math.min(count *25, 100)}px`
            bar.title = `${date}: ${count} books added`
            chartContainer.appendChild(bar)
        })
    }



   
    if (tableBody) {
        tableBody.innerHTML = ""
        if (currentBooks.length === 0) {
            const emptyRow = document.createElement("tr")
            emptyRow.innerHTML = `<td colspan ="6" style ="text-align: center; color: #666; ">No books in vault yet. Add one using the form below! </td>`
            tableBody.appendChild(emptyRow)
            return
        }

        let processedBooks = currentBooks
        if (currentSortField) {
            processedBooks = sortRecords(processedBooks, currentSortField, currentSortAscending)
        }

        const filteredBooks = filterRecordsByRegex(processedBooks, searchQuery, true)
        if (filteredBooks.length === 0) {
            const emptyRow = document.createElement("tr")
            emptyRow.innerHTML = `<td  colspan="6" style="text-align: center; color: #666;">No books found matching your search.</td>`
            tableBody.appendChild(emptyRow)
            return
        }

        filteredBooks.forEach(book => {

            const originalIndex = currentBooks.indexOf(book)

            const row= document.createElement("tr")
            const safeTitle = escapeHTML(book.title || "")
            const titleHTML = searchQuery ? markMatch(safeTitle, searchQuery, true) : safeTitle
            row.innerHTML = `
                <td>${titleHTML}</td>
                <td> ${escapeHTML(book.author)}</td>
                <td>${book.pages}</td>
                <td>${book.read}</td>
                <td>${escapeHTML(book.tag)}</td>
                <td>${escapeHTML(book.date)}</td>
                <td>
                    <button class ="edit-btn" data-index = "${originalIndex}">Edit</button><br><br>
                    <button class = "delete-btn" data-index = "${originalIndex}">Delete</button>
                </td>
            `
            tableBody.appendChild(row)

        });
    }
}

if (tableBody){
    tableBody.addEventListener("click", (e) =>{
        const indexAttr = e.target.getAttribute("data-index")
        if (indexAttr === null) return
        const index = Number(indexAttr)
        const currentQuery = searchInput ? searchInput.value: ""

        if (e.target.classList.contains("delete-btn")){
            const confirmed = window.confirm("Are you sure you want to delete this record?")
            if (confirmed){
                deleteBook(index)
                renderApp(currentQuery)
            }
        }


        if (e.target.classList.contains("edit-btn")){
            const books = getBooks()
            const book = books[index]
            const newTitle= prompt("Edit Book Titl:", book.title)
            if (newTitle === null) return

            const newAuthor = prompt("Edit Author/Category:", book.author)
            if (newAuthor === null)return

            const newPages = prompt("Edit Total Pages:", book.pages)
            if (newPages=== null) return
            
            const newRead=prompt("Edit Pages read:", book.read)
            if (newRead === null) return

            const newTag= prompt("Edit Tag:", book.tag)
            if (newTag=== null) return

            updateBook(index,{
                title: newTitle.trim(),
                author: newAuthor.trim(),
                pages: Number(newPages),
                read: Number(newRead),
                tag: newTag.trim()

            })



        
        renderApp(currentQuery)
        alert("Record updated successfully!")
        }
    })
}



document.querySelectorAll('th').forEach((th, index) => {
    const fields = ['title', 'author', 'pages', 'read', 'tag', 'date']
    const field = fields[index]
    if (field) {
        th.style.cursor = "pointer"
        th.title = "Click to sort"

        th.addEventListener("click", () => {
            if (currentSortField === field) {
                currentSortAscending = !currentSortAscending
            } else {
                currentSortField = field
                currentSortAscending = true
            }
            const currentQuery = searchInput ? searchInput.value : ""
            renderApp(currentQuery)
        })
    }
})




if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value
        renderApp(query)
    })
}

if (bookForm) {
    bookForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formdata = {
            title: document.getElementById("title").value,
            author: document.getElementById("author").value.trim(),
            pages: document.getElementById("pages").value.trim(),
            read: document.getElementById("read").value.trim(),
            tag: document.getElementById("tag").value.trim(),
            date: document.getElementById("date").value.trim()

        }

        const errorMessage = validateFormInput(formdata)
        if (errorMessage) {
            alert(errorMessage)
            return
        }

        addBook(formdata)

        bookForm.reset()

        const currentQuery = searchInput ? searchInput.value : ""

        renderApp(currentQuery)
    })
}

if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        exportToJSON()
    })
}

if (importInput) {
    importInput.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if (!file) return
        importFromJSON(
            file,
            () => {
                alert("JSON file validated and imported successfully!")
                const currentQuery = searchInput ? searchInput.value : ""
                renderApp(currentQuery)
                importInput.value = ""
            },
            (errorMessage) => {
                alert(`Import Failed: ${errorMessage}`)
                importInput.value = ""
            }


        )
    })
}


async function initApp() {
    let records = fromStorage()

    if (!records|| records.length===0){
        try{
            const response = await fetch('./seed.json')
            if (response.ok){
                records = await response.json()
                save_to_storage(records)
            }
        }catch(error){
            console.error("Failed to load seed data:", error)
            records = []
        }
    }
    
    if (typeof setBooks === "function"){
        setBooks(records)
    }
    renderApp()
}

document.addEventListener("DOMContentLoaded", initApp)