import type { DateField } from '@prismicio/client';

// Adicionamos o parâmetro 'lang' com um padrão de 'en-US'
export function formatDate(dateStr: DateField, lang: string = 'en-US'): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // Agora usamos a variável 'lang' em vez de um texto fixo
    let formattedDate = new Intl.DateTimeFormat(lang, options).format(date);

    // Lógica para capitalizar se for Português
    if (lang.toLowerCase() === 'pt-br') {
        formattedDate = formattedDate
            .split(' ') // Divide por espaços
            .map(word => {
                // Se a palavra for "de", mantém minúscula
                if (word.toLowerCase() === 'de') return word;
                // Capitaliza a primeira letra das outras palavras
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' '); // Junta tudo de novo
    }

    return formattedDate;
}