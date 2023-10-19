import mongoose from 'mongoose';
import db from '../db.mjs';

export const api = {
    getItems(req, res) {
        db.getItems()
        .then(items => {
            const result = {
                items: items.map(item => {
                    return {
                        _id: item._id,
                        column: item.column,
                        content: item.content
                    }
                })
            }
            res.json(result);
        })
        .catch(error => console.error(error));
    },
    upsertItem(req, res) {
        const item_id = req.body._id ?? new mongoose.Types.ObjectId();
        const item = {
            _id: item_id,
            column: req.body.column,
            content: req.body.content
        }
        db.upsertItem(item)
        .then(result => res.json(result))
        .catch(error => {
            console.error(error);
            res.json(error);
        });
    }
};

export default api;