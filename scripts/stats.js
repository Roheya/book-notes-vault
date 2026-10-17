export function calculateDashboardStats(books, pageCap =500){
    const totalRecords = books.length;
    const totalPagesRead = books.reduce((sum, book)=>sum + Number(book.read || 0), 0);
    const estimatedHours = (totalPagesRead/30).toFixed(1);
    const tagCounts = {}
    books.forEach(book =>{
        if(book.tag){
            const tag = book.tag.trim().toLowerCase()
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
        }
        
    });
    let topCategory="None";
    let maxCount = 0;
    for (const[tag, count] of Object.entries(tagCounts)){
        if (count > maxCount){
            maxCount= count
            topCategory = tag.charAt(0).toUpperCase() + tag.slice(1)
        }
    }
    const last7DaysData = getLast7DaysTrend(books)
    const remainingOrOverage = pageCap - totalPagesRead
    let ariaLiveType = "polite"
    let capMessage =""
    if (remainingOrOverage>=0){
        capMessage = `You are ${remainingOrOverage} pages away from your reading goal of ${pageCap} pages.`
        ariaLiveType = "polite"
    }else{
        capMessage = `Goal exceeded by ${Math.abs(remainingOrOverage)} pages! Great job!`
        ariaLiveType = "assertive"
    }
    return{
        totalRecords,
        totalPagesRead,
        topCategory,
        last7DaysData,
        capMessage,
        ariaLiveType,
        estimatedHours
    }
}

function getLast7DaysTrend(books){
    const days ={}
    const today = new Date()
    for (let i = 6; i>=0; i--){
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const dateString = d.toISOString().split('T')[0]
        days[dateString] = 0
    }

    books.forEach(book =>{
        if (book.date && days[book.date] !== undefined){
            days[book.date]++
        }
    })
    return days
}