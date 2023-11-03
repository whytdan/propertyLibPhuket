// import { Client } from 'amocrm-js';
// import { env } from '../env.js';

// export const amoCrmClient = new Client({
//   // логин пользователя в портале, где адрес портала domain.amocrm.ru
//   domain: env.AMO_CRM_DOMAIN, // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
//   /* 
//     Информация об интеграции (подробности подключения 
//     описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
//   */
//   auth: {
//     client_id: env.AMO_CRM_CLIENT_ID, // ID интеграции
//     client_secret: env.AMO_CRM_CLIENT_SECRET, // Секретный ключ
//     redirect_uri: env.AMO_CRM_REDIRECT_URL, // Ссылка для перенаправления,
//     code: env.AMO_CRM_CODE,
//   },
// });

// console.log('amoCrmClient', {
//   client_id: env.AMO_CRM_CLIENT_ID, // ID интеграции
//   client_secret: env.AMO_CRM_CLIENT_SECRET, // Секретный ключ
//   redirect_uri: env.AMO_CRM_REDIRECT_URL, // Ссылка для перенаправления,
//   code: env.AMO_CRM_CODE,
// });

// amoCrmClient.token.fetch().then((tokens) => {
//   console.log("amoCrmClient.token.fetch", tokens);
// })
//   .catch((error) => {
//     console.error("amoCrmClient.token.fetch error", error);
//   });

// export default amoCrmClient;