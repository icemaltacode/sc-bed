import mongoose from 'mongoose';

export const itemSchema = mongoose.Schema({
    column: String,
    content: String
});

export const Item = mongoose.model('Item', itemSchema);

export default Item;