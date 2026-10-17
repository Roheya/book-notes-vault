export function validateFormInput(data){
    const titleRegex =   /^\S(?:.*\S)?$/
    if(!data.title ||!titleRegex.test(data.title)){
        return "Title cannot have leading or trailing whitespace"
    } 

    const numRegx = /^(0|[1-9]\d*)(\.\d{1,2})?$/
    if (!data.pages  || !numRegx.test(data.pages )){
        return"Pages must be a valid positive number"

    }
    
    if (!data.read  || !numRegx.test(data.read )){
        return"Pages read must be a valid positive number"

    }

    const  dateRegx = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
    if(!data.date || !dateRegx.test(data.date)){
        return"Date must be in valid YYYY-MM-DD format"
    }

    const tagRegx = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
    if(!data.tag || !tagRegx.test(data.tag)){
        return "Tag/Category can only contain letters, spaces, and hyphens."
    }
    const dRegex = /\b(\w+)\s+\1\b/
    if(dRegex.test(data.title)){
        return "Title contains accidental duplicate words"
    }
    return null
    
}
