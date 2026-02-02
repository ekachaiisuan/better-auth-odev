const API_URL = 'https://697c84f7889a1aecfeb2b187.mockapi.io/books';

interface Document {
    id: string;
    name: string;
    desc: string;
}

export async function searchDocuments(query: string) {
    const response = await fetch(
        `${API_URL}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch documents');
    }

    const data = await response.json().then((data: Document[]) => {
        return data.filter(doc => doc.name.toLowerCase().includes(query.toLowerCase()));
    })

    return data;
}