import { KeyOfSessionInCookie } from '../constants/KeyOfSessionInCookie';
import { SessionData } from '../models/SessionData';
import { AuthSessionStorage } from '~/shared/remixjs/server';

export const authSessionStorage = new AuthSessionStorage<SessionData>({
  loginUrl: '/login', // URL to redirect to upon login
  options: {
    name: KeyOfSessionInCookie,
  },
});
