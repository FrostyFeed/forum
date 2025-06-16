
import { parseISO, format } from 'date-fns'
import { uk } from 'date-fns/locale';
export default function formatDate(dateString) {
    const date = parseISO(dateString);
    return format(date, "d MMMM yyyy 'р. ' HH:mm ", { locale: uk })
}
export function formatRegisterDate(dateString) {
    const date = new Date(dateString);

    const formatted = date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return formatted
}