/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import sendVerifyEmail from '#mails/sendVerifyEmail'
import LoginController from '#controllers/auth/login_controller'
import RegisterController from '#controllers/auth/register_controller'
import ComicsController from '#controllers/comics_controller'
import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import { middleware } from './kernel.js'
import HomeController from '#controllers/home_controller'
import LogoutController from '#controllers/auth/logout_controller'
import GenresController from '#controllers/admin/genres_controller'
import CoinPackagesController from '#controllers/admin/coin_packages_controller'
import EpisodesController from '#controllers/episodes_controller'
import DashboardAdminsController from '#controllers/admin/dashboard_admins_controller'
import UsersController from '#controllers/users_controller'
import PagesController from '#controllers/pages_controller'
import TransactionsController from '#controllers/transactions_controller'
import CommentsController from '#controllers/comments_controller'
import PurchasesController from '#controllers/purchases_controller'
// Home
router.get('/', [HomeController, 'index']).as('home').use([middleware.silentAuth(), middleware.bannedUser()])
router.get('/library', [HomeController, 'savedComic']).use(middleware.silentAuth())
router.get('/search', [HomeController, 'search']).use(middleware.silentAuth())
router.get('/admin', [DashboardAdminsController, 'index']).as('AdminHomepage').use(middleware.isAdmin())
// router.get('/admin', [DashboardAdminsController, 'index']).as('AdminHomepage')
router.get('/admin/users', [DashboardAdminsController, 'getAllUsers']).use(middleware.isAdmin())
router.get('/admin/comics', [DashboardAdminsController, 'getAllComic']).use(middleware.isAdmin())

router.get('/verify-email', async ({ request, response }) => {
  const token = request.input('token')

  if (!token) {
    return response.badRequest('Invalid verification link')
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  const record = await db
    .from('email_verifications')
    .where('token_text', hashedToken)
    .first()

  if (!record) {
    return response.badRequest('Verification link invalid')
  }

  if (
    record.expired_at &&
    DateTime.fromJSDate(record.expired_at) < DateTime.now()
  ) {
    return response.badRequest('Verification link expired')
  }

  await db
    .from('users')
    .where('id', record.user_id)
    .update({
      is_verified: true,
    })

  await db
    .from('email_verifications')
    .where('user_id', record.user_id)
    .delete()

  return response.redirect('/login')
})

router.post('/users/:id/ban', [DashboardAdminsController, 'banUser']).use(middleware.isAdmin())
router.post('/users/:id/unban', [DashboardAdminsController, 'unbanUser']).use(middleware.isAdmin())
router.post('/comics/:slug/ban', [DashboardAdminsController, 'banComic']).use(middleware.isAdmin())
router.post('/comics/:slug/unban', [DashboardAdminsController, 'unBanComic']).use(middleware.isAdmin())

router.get('/ban-page', [HomeController, 'banPage'])

// Auth
router.group(() => {
  router.get('/register', [RegisterController, 'index']).as('register.index')
  router.post('/register', [RegisterController, 'store']).as('register.store')
  router.get('/login', [LoginController, 'index']).use(middleware.guest())
  router.post('/login', [LoginController, 'store']).use(middleware.guest())
  router.post('/logout', [LogoutController, 'handle'])
})

// Profile
router
  .group(() => {
    router.get('/show', [UsersController, 'show']).use([middleware.auth(), middleware.bannedUser()])
    router.get('/edit/:username', [UsersController, 'edit']).use(middleware.auth())
    router.put('/update', [UsersController, 'update']).use(middleware.auth())
  })
  .prefix('/profile')

// Comics
router
  .group(() => {
    router.get('/index', [ComicsController, 'index']).use(middleware.auth())
    router.get('/create', [ComicsController, 'create']).use(middleware.auth())
    router.post('/store', [ComicsController, 'store']).use(middleware.auth())
    router.get('/show/:slug', [ComicsController, 'show']).use(middleware.silentAuth())
    router.put('/update/:slug', [ComicsController, 'update']).use(middleware.auth())
    router.get('/edit/:slug', [ComicsController, 'edit']).use(middleware.auth())
    router.delete('/destroy/:slug', [ComicsController, 'destroy']).use(middleware.auth())
    router.post('/favorite/:slug', [ComicsController, 'favorite']).use(middleware.auth())
    router.post('/rating/:slug', [ComicsController, 'rate']).use(middleware.auth())
  })
  .prefix('/comic')

// Episodes
router
  .group(() => {
    router.get('/:slug/index', [EpisodesController, 'index']).use(middleware.auth())
    router.get('/:slug/create', [EpisodesController, 'create'])
    router.get('/edit/:slug', [EpisodesController, 'edit']).use(middleware.auth())
    router.post('/:slug/store', [EpisodesController, 'store'])
    router.get('/:slug/show/:episodeSlug', [EpisodesController, 'show']).use(middleware.silentAuth())
    router.put('/:slug/update/:episodeSlug', [EpisodesController, 'update']).use(middleware.auth())
    router.delete('/delete/:slug', [EpisodesController, 'destroy']).use(middleware.auth())
  })
  .prefix('/episode')

// Pages
router
  .group(() => {
    router.post('/:comicSlug/store/:episodeSlug', [PagesController, 'store']).use(middleware.auth())
    router.get('/:comicSlug/create/:episodeSlug', [PagesController, 'create'])
    router.get('/:episodeId/edit', [PagesController, 'edit']).use(middleware.auth())
    router.put('/:episodeId/update/', [PagesController, 'update']).use(middleware.auth())
    router.delete('/destroy/:id', [PagesController, 'destroy'])
  })
  .prefix('/pages')

// Episode Like
router.group(() => {
  router.post('/episode/like/:id', [EpisodesController, 'likeEpisode']).use(middleware.auth())
})

// Comments
router
  .group(() => {
    router.get('/index/comic/:comicSlug/episode/:episodeSlug/', [CommentsController, 'index']).use(middleware.silentAuth())
    router.post('/episode/:episodeSlug/store', [CommentsController, 'store']).use(middleware.auth())
    router.delete('/:id/destroy', [CommentsController, 'destroy']).use(middleware.auth())
    router.post('/like/:id', [CommentsController, 'likeComment']).use(middleware.auth())
  })
  .prefix('/comment')

// Genres
router
  .group(() => {
    router.get('/index', [GenresController, 'index'])
    router.get('/create', [GenresController, 'create'])
    router.post('/store', [GenresController, 'store'])
    router.get('/edit/:id', [GenresController, 'edit'])
    router.put('/update/:id', [GenresController, 'update'])
    router.delete('/destroy/:id', [GenresController, 'destroy'])
  })
  .prefix('/admin/genres')
  .use(middleware.isAdmin())

// Coin Packages
router
  .group(() => {
    router.get('/index', [CoinPackagesController, 'index'])
    router.get('/create', [CoinPackagesController, 'create'])
    router.post('/store', [CoinPackagesController, 'store'])
    router.get('/edit/:id', [CoinPackagesController, 'edit'])
    router.put('/update/:id', [CoinPackagesController, 'update'])
    router.delete('/destroy/:id', [CoinPackagesController, 'destroy'])
  })
  .prefix('/admin/coin')
  .use(middleware.isAdmin())

router.post('/create', [PurchasesController, 'buyEpisode']).use(middleware.auth())

router
  .group(() => {
    router.post('/create', [TransactionsController, 'createTransaction']).use(middleware.auth())
    router.post('/webhook', [TransactionsController, 'handleWebhook']) // public aja
    router.get('/status/:orderId', [TransactionsController, 'checkStatus']) //public ajaa
    router.get('/history', [TransactionsController, 'getHistory']).use(middleware.auth())
  })
  .prefix('/transaction')


router.post('/episodes/:id/buy', [PurchasesController, 'buyEpisode']).use(middleware.auth())
// router.get('/episodes/:id/check', [PurchasesController, 'checkPurchase']).use(middleware.auth())
// router.get('/purchases', [PurchasesController, 'index']).use(middleware.auth())
// router.get('/wallet', [PurchasesController, 'getWallet']).use(middleware.auth())
//
//


// router.get('/test-email', async () => {
//   await sendVerifyEmail(
//     '11231090@student.itk.ac.id',
//     'http://127.0.0.1:3333/login'
//   )
//   return 'OK'
// })
