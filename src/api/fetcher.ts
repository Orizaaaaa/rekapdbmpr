export const fetcher = async (...args: Parameters<typeof fetch>) => {
    const [url, options] = args;
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            'Authorization': token || '',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};