import express, { Application } from 'express';
import AdminJS, { AdminJSOptions } from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Resource, Database } from '@adminjs/mongoose';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swaggerDocument from '../swagger.json' assert { type: 'json' };
import { componentLoader } from './utils/componentLoader.js';
import { RealEstateResource } from './resources/RealEstateResource.js';
import { LocationResource } from './resources/LocationResource.js';
import { env } from './env.js';

import realEstatesRouter from './routes/realEstates.js';
import locationsRouter from './routes/locations.js';
import getAllTopObjectsRouter from './routes/getAllTopObjects.js';
import leadsRouter from './routes/leads.js';
import amoCrmRouter from './routes/amocrm.js';
import { PublicPlaceResource } from './resources/PublicPlaceResource.js';

AdminJS.registerAdapter({
  Resource,
  Database,
});

const initDBConnection = async () => {
  console.log('Connecting to Database...');

  await mongoose.connect(env.DATABASE_URL, {});

  const db = mongoose.connection;

  db.on('error', (error: any) =>
    console.error(`MongoDB connection error: ${error}`)
  );

  db.once('open', () => {
    console.log('Connected to Database!');
  });
};

const initAdminPanel = async (app: Application): Promise<AdminJS> => {
  const adminOptions: AdminJSOptions = {
    resources: [RealEstateResource, LocationResource, PublicPlaceResource],
    componentLoader: componentLoader,
  };

  const DEFAULT_ADMIN = {
    email: env.ADMIN_USER_EMAIL,
    password: env.ADMIN_USER_PASSWORD,
  };

  const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return Promise.resolve(DEFAULT_ADMIN);
    }
    return false;
  };

  const admin = new AdminJS(adminOptions);
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    // Add configuration required by the express-session plugin.
    {
      resave: false,
      saveUninitialized: true,
    }
  );
  app.use(admin.options.rootPath, adminRouter);

  return admin;
};

const start = async () => {
  // app initialization
  const app = express();

  // init DB connection
  await initDBConnection();

  // app middlewares
  app.use(express.json());
  app.use(
    cors({
      origin: '*',
    })
  );

  // admin panel initialization
  const admin = await initAdminPanel(app);

  // routes
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/realEstates', realEstatesRouter);
  app.use('/locations', locationsRouter);
  app.use('/getAllTopObjects', getAllTopObjectsRouter);
  app.use('/leads', leadsRouter);
  app.use('/amocrm', amoCrmRouter);

  app.listen(env.PORT, () => {
    console.log('Server Started');
    console.log(
      `AdminJS started on http://${env.HOST}:${env.PORT}${admin.options.rootPath} or https://${env.HOST}:${env.PORT}${admin.options.rootPath}`
    );
  });

  admin.watch();
};

start();
