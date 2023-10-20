import { createClient } from 'redis';

const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

export async function getPaintings(searchTerm) {
    return await client.get(searchTerm);
}

export async function saveResult(searchTerm, searchResult) {
    return await client.set(searchTerm, searchResult);
}

export default {
    getPaintings,
    saveResult
};