import express, { Application } from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Resource, Database } from '@adminjs/mongoose';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { RealEstate } from './models/RealEstate.js';

import realEstatesRouter from './routes/realEstates.js';

dotenv.config();

AdminJS.registerAdapter({
  Resource,
  Database,
});

const initDBConnection = async () => {
  console.log('Connecting to Database...');

  if (process.env.DATABASE_URL) {
    await mongoose.connect(process.env.DATABASE_URL, {});

    const db = mongoose.connection;

    db.on('error', (error: any) =>
      console.error(`MongoDB connection error: ${error}`)
    );

    db.once('open', () => {
      console.log('Connected to Database!');
    });
  } else {
    throw new Error('Provide process.env.DATABASE_URL variable');
  }
};

const initAdminPanel = async (app: Application): Promise<AdminJS> => {
  const adminOptions = {
    resources: [RealEstate],
  };

  const DEFAULT_ADMIN = {
    email: process.env.ADMIN_USER_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_USER_PASSWORD || 'password',
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

  // admin panel initialization
  const admin = await initAdminPanel(app);

  // routes
  app.use('/realEstates', realEstatesRouter);

  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log('Server Started');
    console.log(
      `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`
    );
  });
};

start();
