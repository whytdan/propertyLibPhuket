import { Client } from 'amocrm-js';
import { env } from '../env.js';

export const amoCrmClient = new Client({
  // логин пользователя в портале, где адрес портала domain.amocrm.ru
  domain: env.AMO_CRM_DOMAIN, // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
  /* 
    Информация об интеграции (подробности подключения 
    описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
  */
  auth: {
    client_id: env.AMO_CRM_CLIENT_ID, // ID интеграции
    client_secret: env.AMO_CRM_CLIENT_SECRET, // Секретный ключ
    redirect_uri: env.AMO_CRM_REDIRECT_URL, // Ссылка для перенаправления,
    /*
          Необязательный араметр состояния для проверки на корректность. 
          Используется встроенным сервером авторизации.
          см. https://www.amocrm.ru/developers/content/oauth/step-by-step#%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-Authorization-code
      */
    state: 'state',
  },
});

console.log(amoCrmClient.auth.getUrl());

export default amoCrmClient;