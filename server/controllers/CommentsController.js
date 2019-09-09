import express from 'express'
import BloggerService from '../services/BloggerService';
import { Authorize } from '../middleware/authorize.js';
import CommentsService from '../services/CommentsService.js';

let _commentsService = new CommentsService().repository
let _bloggerService = new BloggerService().repository

export default class CommentsController {
  constructor() {
    this.router = express.Router()
      //NOTE all routes after the authenticate method will require the user to be logged in to access
      .use(Authorize.authenticated)
      .get('', this.getAll)
      .get('/:id', this.getById)
      //.get('/blogs/:id/comments', this.getById)

      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)

  }

  async getAll(req, res, next) {
    try {
      let data = await _commentsService.find({}).populate("author", "name")
      return res.send(data)
    } catch (error) { next(error) }

  }

  async getById(req, res, next) {
    try {
      let data = await _commentsService.findById(req.params.id).populate("author", "name")
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send(data)
    } catch (error) { next(error) }
  }

  async create(req, res, next) {
    try {
      //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
      req.body.authorId = req.session.uid
      req.body.blogs
      let data = await _commentsService.create(req.body)
      res.send(data)
    } catch (error) { next(error) }
  }

  async edit(req, res, next) {
    try {
      req.body.authorId = req.session.uid
      let data = await _commentsService.findOneAndUpdate({ _id: req.params.id, authorId: req.session.uid }, req.body, { new: true })
      if (data) {
        return res.send(data)
      }
      throw new Error("invalid id")
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      await _commentsService.findOneAndRemove({ _id: req.params.id })
      res.send("deleted value")
    } catch (error) { next(error) }

  }

}