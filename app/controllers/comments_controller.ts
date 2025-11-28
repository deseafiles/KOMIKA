import Comment from '#models/comment'
import Episode from '#models/episode'
import {createCommentValidator} from '#validators/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  /**
   * Display a list of resource
   */
async index({ params, inertia }: HttpContext) {
  const episode = await Episode.findByOrFail("slug", params.episodeSlug)

  const comments = await Comment
    .query()
    .where("episode_id", episode.id)
    .preload("user")
    .preload("episodes", c => {
      c.preload('comics')
    })
    .preload("commentLike")

  const commentsWithLikeCount = comments.map(c => ({
    ...c.serialize(),
    likeCount: c.commentLike.length,
    isLike: c.commentLike.some(u => u.id === 1)
  }))

  return inertia.render("comment/index", {
    episode,
    comment: commentsWithLikeCount
  })
}

  // /**
  //  * Display form to create a new record
  //  */
  // async create({ inertia }: HttpContext) {
  //   return inertia.render('comment/create')
  // }

  /**
   * Handle form submission for the create action
   */
async store({ params, request, response, auth }: HttpContext) {
  const user = auth.user!
  const { episodeSlug } = params
  const { content, parentCommentId } = await request.validateUsing(createCommentValidator)

  const episode = await Episode.findByOrFail('slug', episodeSlug)

  await Comment.create({
    userId: user.id,
    episodeId: episode.id,
    parentCommentId,
    content
  })

  return response.redirect().back()
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

  async likeComment({ params, auth, response}: HttpContext) {
    const user = auth.user!
    const like = await user.related('userCommentLike').query().where('comment_id', params.id).first()

    if(like) {
      await user.related('userCommentLike').detach([params.id])
    } else {
      await user.related('userCommentLike').attach([params.id])
    }

    return response.redirect().back()
  }
  //wip reply comment feature
}
