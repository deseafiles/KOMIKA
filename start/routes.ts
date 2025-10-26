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
import GenresController from '#controllers/genres_controller'
import CoinPackagesController from '#controllers/coin_packages_controller'
import EpisodesController from '#controllers/episodes_controller'

router.get('/', [HomeController, 'index']).as('home')

router.get('/comic/coverUrl/:fileName', [ComicsController, 'showCoverImage']).use(middleware.auth())

router.group(() => {
  router.get('/register', [RegisterController, 'index'])
  router.post('/register', [RegisterController, 'store'])
  router.get('/login', [LoginController, 'index'])
  router.post('/login', [LoginController, 'store'])
  router.post('/logout', [LogoutController, 'handle']).use(middleware.auth())
})

//done, harusnya
router
  .group(() => {
    router.get('/index', [ComicsController, 'index']).use(middleware.guest())
    router.get('/create', [ComicsController, 'create']).use(middleware.auth())
    router.post('/store', [ComicsController, 'store']).use(middleware.auth())
    router.get('/show/:slug', [ComicsController, 'show']).use(middleware.auth())
    router.put('/update/:slug', [ComicsController, 'update']).use(middleware.auth())
    router.get('/edit', [ComicsController, 'edit']).use(middleware.auth())
    router.delete('/destroy/:slug', [ComicsController, 'destroy']).use(middleware.auth())
  })
  .prefix('/comic')

//fix route
router.group(() => {
  router.get('episodes', 'EpisodesController.index')
  router.get('episodes/create', 'EpisodesController.create')
  router.post('/episodes/store', [EpisodesController, 'store'])
  router.get('episodes/:id/edit', 'EpisodesController.edit')
  router.put('episodes/update/:id', [EpisodesController, 'update'])
  router.delete('episodes/:id', 'EpisodesController.destroy')
})
  .prefix('/creator')
  .use(middleware.auth())

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
  .prefix('/genre')
  .use(middleware.auth())
  .use(middleware.isAdmin())

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
  .prefix('/coin')


router.post('/midtrans/test', async ({ response }) => {
  const service = new (await import('#services/midtrans_service')).MidtransService()

  const token = await service.createTransaction({
    id: 1,
    name: 'Packet 1',
    price: 15000,
  })

  return response.json({ token })
})

