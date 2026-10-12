const storage = "book_vault_records"
export function fromStorage(){
    const data = localStorage.getItem(storage)
    return data ? JSON.parse(data): []
}

export function save_to_storage(records){
    localStorage.setItem(storage, JSON.stringify(records))
}

