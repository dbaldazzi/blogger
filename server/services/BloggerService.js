import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    authorId: { type: ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default class BloggerService {
    get repository() {
        return mongoose.model('blogs', _model)
    }
}