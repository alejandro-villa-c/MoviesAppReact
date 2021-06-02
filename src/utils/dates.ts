export const formatIsoDateAsShortDate = (isoDate: string) => {
    if (isoDate) {
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    }
    return '';
};