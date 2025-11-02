/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import LoginController from '#controllers/auth/login_controller'
import RegisterController from '#controllers/auth/register_controller'
import ComicsController from '#controllers/comics_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import HomeController from '#controllers/home_controller'
import LogoutController from '#controllers/auth/logout_controller'
import GenresController from '#controllers/admin/genres_controller'
import CoinPackagesController from '#controllers/admin/coin_packages_controller'
import EpisodesController from '#controllers/episodes_controller'
import DashboardAdminsController from '#controllers/admin/dashboard_admins_controller'

router.get('/', [HomeController, 'index']).as('home')

router.get('/admin/index', [DashboardAdminsController, 'index'])

router.group(() => {
  router.get('/register', [RegisterController, 'index']).as('register.index')
  router.post('/register', [RegisterController, 'store']).as('register.store')
  router.get('/login', [LoginController, 'index'])
  router.post('/login', [LoginController, 'store'])
  router.post('/logout', [LogoutController, 'handle']).use(middleware.auth())
})

//done, harusnya
router
  .group(() => {
    router.get('/index', [ComicsController, 'index']).use(middleware.auth())
    router.get('/create', [ComicsController, 'create']).use(middleware.auth())
    router.post('/store', [ComicsController, 'store']).use(middleware.auth())
    router.get('/show/:slug', [ComicsController, 'show']).use(middleware.auth())
    router.put('/update/:slug', [ComicsController, 'update']).use(middleware.auth())
    router.get('/edit', [ComicsController, 'edit']).use(middleware.auth())
    router.delete('/destroy/:slug', [ComicsController, 'destroy']).use(middleware.auth())
    router.post('/favorite/:slug', [ComicsController, 'favorite']).use(middleware.auth())
    router.post('/rating/:slug', [ComicsController, 'rate']).use(middleware.auth())
  })
  .prefix('/comic')

//done
router.group(() => {
  router.get('/index', [EpisodesController, 'index'])
  router.get('/create', [EpisodesController, 'create'])
  router.get('/edit/:id', [EpisodesController, 'edit'])
  router.post('/store', [EpisodesController, 'store'])
  router.put('/update', [EpisodesController, 'update'])
  router.delete('/delete/:id', [EpisodesController, 'destroy'])
})
  .prefix('/episode')
  .use(middleware.auth())

router.group(() => {
  //router.get('/comics/episode/:id', [EpisodesController, 'listByComic'])
  router.post('/episode/like/:id', [EpisodesController, 'likeEpisode']).use(middleware.auth())
})
// 🌍 Public reader routes
//Route.get('/comics/:slug/episodes', 'EpisodesController.listByComic')
//Route.get('/episodes/:id', 'EpisodesController.showPublic')

router
  .group(() => {
    router.get('/index', [GenresController, 'index'])
    router.post('/create', [GenresController, 'create'])
    router.post('/store', [GenresController, 'store'])
    router.delete('/destroy/:id', [GenresController, 'destroy'])
  })
  .prefix('/admin/genres')

//DONE TESTING USING POSTMAN
router
  .group(() => {
    router.get('/index', [CoinPackagesController, 'index'])
    router.post('/create', [CoinPackagesController, 'create'])
    router.post('/store', [CoinPackagesController, 'store'])
    router.get('/edit/:id', [CoinPackagesController, 'edit'])
    router.put('/update/:id', [CoinPackagesController, 'update'])
    router.delete('/destroy/:id', [CoinPackagesController, 'destroy'])
    router.get('/show/:id', [CoinPackagesController, 'show'])
  })
  .prefix('admin/coin')


router.post('/midtrans/test', async ({ response }) => {
  const service = new (await import('#services/midtrans_service')).MidtransService()

  const token = await service.createTransaction({
    id: 1,
    name: 'Packet 1',
    price: 15000,
  })

  return response.json({ token })
})

