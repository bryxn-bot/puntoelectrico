import { useEffect } from 'react';

// Reemplazo simple de <Head title="..."> de Inertia: cambia el título de la pestaña.
export default function Head({ title }) {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);
    return null;
}