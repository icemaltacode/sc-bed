import mongoose from 'mongoose';
import credentials from './config.mjs';
import Item from './models/Item.mjs';

const uri = credentials.mongo.uri;

mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => {
    console.error('MongoDB error: ' + err.message);
    process.exit(1);
});
db.once('open', () => console.log('MongoDB Connection Established.'));

export function getItems() {
    return Item.find();
}

export function upsertItem(item) {
    return Item.findOneAndUpdate( { '_id': item._id }, item, { upsert: true, new: true } );
}

export default {
    getItems,
    upsertItem
};