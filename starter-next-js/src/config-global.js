import { paths } from 'src/routes/paths';
import packageJson from '../package.json';

export const CONFIG = {
  appName: 'Wise Code Test',
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
   assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',

  auth: {
    method: 'jwt',
    skip: true, // ← DÉSACTIVER L'AUTH
    redirectPath: paths.dashboard.categories,
  },
};
