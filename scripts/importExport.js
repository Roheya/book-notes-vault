import { books, BooksState } from "./state.js";

export function isValidRecord(item){
    if (!item || typeof item !== "object") return false

    return(
        typeof item.id === "string" && /^rec_\d+$/.test(item.id) &&
        typeof item.title === "string" && item.title.trim() !=="" &&
        typeof item.author === "string" && item.author.trim() !== ""&&
        typeof item.pages === "number" &&
        typeof item.read === "number" &&
        typeof item.tag === "string" &&
        typeof item.date === "string" &&
        typeof item.createdAt === "string" &&
        typeof item.updatedAt === "string"
    )
}

export function validateImportData(data){
    if (!Array.isArray (data)){
        return {valid: false, error: "JSON must be an array of records"}
    }

    if (data.length === 0){
        return{valid: false, error: "The uploaded file in empty"}
    }

    for(let i = 0; i < data.length; i++){
        if (!isValidRecord(data[i])){
            return{
                valid: false,
                error: `Record at index ${i} fails schema structure check`
            }
        }
    }
    return {valid: true, error:null}
}

export function importFromJSON(file, onSuccess, onError){
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e)=> {
        try{
            const parsedData = JSON.parse(e.target.result)
            const validation = validateImportData(parsedData)
            if (!validation.valid){
                onError(validation.error)
                return
            }
            BooksState(parsedData)
            onSuccess(parsedData)
        } catch(err){
            onError("File is not valid JSON")
        }
    }
    reader.readAsText(file)
}


export function exportToJSON(){
    const jsonString = JSON.stringify(books, null, 2)
    const blob = new Blob([jsonString], {type: "application/json"})
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `books_backup_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}