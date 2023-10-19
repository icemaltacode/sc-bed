const BASE_URI = "http://localhost:3001/api";

const rkanbanApi = {
    async getItems() {
        return fetch(`${BASE_URI}/items`)
                .then(res => res.json())
                .catch(error => {
                    console.error(error);
                    return false;
                });
    },
    async upsertItem(item) {
        return fetch(`${BASE_URI}/item`, { 
            method: 'PUT', 
            mode: 'cors', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item)
        })
        .then(res => res.json())
        .catch(error => {
            console.error(error);
            return false;
        });
    }
};

export default rkanbanApi;