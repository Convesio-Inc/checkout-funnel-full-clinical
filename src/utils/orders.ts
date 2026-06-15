export function formatCurrency(amount: number, currencyCode: string) {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
}

export function formatDate(date: string) {
    const dateObj = new Date(date);
    return {
        date: dateObj.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        time: dateObj.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        }),
    };
}