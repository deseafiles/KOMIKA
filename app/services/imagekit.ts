// import ImageKit from "imagekit"
// import env from '#start/env'
//
// const imagekit = new ImageKit({
//   publicKey: env.get('IMAGEKIT_PUBLIC_KEY'),
//   privateKey: env.get('IMAGEKIT_PRIVATE_KEY'),
//   urlEndpoint: env.get('IMAGEKIT_URL_ENDPOINT'),
// })
//
// export async function uploadToImageKit(filePath: string, fileName: string) {
//   const result = await imagekit.upload({
//     file: filePath,
//     fileName,
//     folder: "/comics", // folder opsional di ImageKit
//   })
//
//   return result.url // simpan ini ke DB
// }
//
// export default imagekit
//
