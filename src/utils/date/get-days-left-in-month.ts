export const getDaysLeftInMonth = (date: Date) => {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const daysLeftInMonth = lastDayOfMonth - date.getDate() + 1; // inclu today

    return {daysLeftInMonth, lastDayOfMonth};
}