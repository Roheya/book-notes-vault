export function sortRecords(records, field, ascending){
    return [...records].sort((a, b) =>{
        let valueA = a[field]
        let valueB = b[field]
        if (typeof valueA == 'string'){
            return ascending ? valueA.localeCompare(valueB): valueB.localeCompare(valueA)
        }
        return ascending ? valueA - valueB: valueB - valueA
    })
}


export function filterRecordsByRegex(records, query, isCaseInsensitive){
    try{
        if (!query) return records
        const flags = isCaseInsensitive ? "i":""
        const regex = new RegExp(query, flags)

        return records.filter(record =>  record.title && regex.test(record.title))
    
    } catch(e){
        return records
    }
}

export function markMatch(text, query, isCaseInsensitive){
    if (!query || !text) return text
    try{
        const flags = isCaseInsensitive ? "gi" :"g"
        const regex = new RegExp(`${query}`, flags)
        return text.replace(regex, `<mark>$1</mark>`)

    }catch (e){
        return text
    }
}