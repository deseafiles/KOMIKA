import Comment from '#models/comment'
import User from '#models/user'
import {createCommentValidator} from '#validators/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  /**
   * Display a list of resource
   */
  async index({ inertia, params }: HttpContext) {
    const comment = await Comment
                         .query()
                         .preload('episodes', (episodeQuery) => {
                            episodeQuery.where('id', params.id)
                         })
                         .preload('user')

    return inertia.render('comment/index', { comment })
  }

  /**
   * Display form to create a new record
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('comment/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { episodeId, content, parentCommentId } = await request.validateUsing(createCommentValidator)

    const comment = await Comment.create({
      episodeId,
      parentCommentId,
      content,
    })

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Comic created successfully',
        data: comment
      })
    }


    return response.redirect().toRoute('/comment/index')
  }

  /**
   * Delete record
   */
  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const comment = await Comment
                         .query()
                         .where('id', params.id)
                         .where('user_id', user.id)
                         .firstOrFail()

    await comment.delete()
    return response.redirect().back()
  }

  async likeComment({ params, auth}: HttpContext) {
    const user = auth.user!
    const like = await user.related('userCommentLike').query().where('comment_id', params.id).first()

    if(like) {
      await user.related('userCommentLike').detach([params.id])
    } else {
      await user.related('userCommentLike').attach([params.id])
    }
  }

  //wip reply comment feature
}
