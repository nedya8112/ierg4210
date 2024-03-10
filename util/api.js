export async function getData(endpoint) {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            method: 'GET'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch data from the API');
    }
}

export async function postData(endpoint, formData) {
    try {
        console.log(formData);
        const response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to post data to the API');
    }
}