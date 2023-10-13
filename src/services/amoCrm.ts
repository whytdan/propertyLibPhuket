import dotenv from 'dotenv';
import { Client } from 'amocrm-js';

dotenv.config();

const AMO_CRM_DOMAIN = process.env.AMO_CRM_DOMAIN || '';
const AMO_CRM_CLIENT_ID = process.env.AMO_CRM_CLIENT_ID || '';
const AMO_CRM_CLIENT_SECRET = process.env.AMO_CRM_CLIENT_SECRET || '';
const AMO_CRM_REDIRECT_URL = process.env.AMO_CRM_REDIRECT_URL || '';

const amoCrmClient = new Client({
  // логин пользователя в портале, где адрес портала domain.amocrm.ru
  domain: AMO_CRM_DOMAIN, // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
  /* 
    Информация об интеграции (подробности подключения 
    описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
  */
  auth: {
    client_id: AMO_CRM_CLIENT_ID, // ID интеграции
    client_secret: AMO_CRM_CLIENT_SECRET, // Секретный ключ
    redirect_uri: AMO_CRM_REDIRECT_URL, // Ссылка для перенаправления,
    /*
          Необязательный араметр состояния для проверки на корректность. 
          Используется встроенным сервером авторизации.
          см. https://www.amocrm.ru/developers/content/oauth/step-by-step#%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-Authorization-code
      */
    state: 'state',
    server: {
      // порт, на котором запустится сервер авторизации
      port: 8000,
    },
  },
});

export default amoCrmClient;
