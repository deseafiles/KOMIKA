// import { test } from '@japa/runner'
// import { validator } from '@adonisjs/validator'
// import { createComicValidator } from '#validators/comic'
//
// test.group('CreateComicValidator | title', () => {
//   test('reject empty title', async ({ assert }) => {
//     const payload = {
//       title: '',
//       description: 'desc',
//       genreIds: [],
//     }
//
//     try {
//       await validator.validate({
//         schema: createComicValidator.schema,
//         data: payload,
//       })
//
//       assert.fail('Validation should fail when title is empty')
//     } catch (error) {
//       assert.equal(error.messages[0].field, 'title')
//     }
//   })
//
//   test('accept valid title', async ({ assert }) => {
//     const payload = {
//       title: 'My Comic',
//       description: 'desc',
//       genreIds: [],
//     }
//
//     const result = await validator.validate({
//       schema: createComicValidator.schema,
//       data: payload,
//     })
//
//     assert.equal(result.title, 'My Comic')
//   })
// })
