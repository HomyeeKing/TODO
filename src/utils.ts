export function formatDate(timestamp:number){
    const d = new Date(timestamp ?? 0)
    return `${d.getFullYear()} - ${d.getMonth()} - ${d.getDay()}`
}