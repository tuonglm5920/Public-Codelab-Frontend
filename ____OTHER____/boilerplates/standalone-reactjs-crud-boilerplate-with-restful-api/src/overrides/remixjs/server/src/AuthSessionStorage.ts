import { isEmpty, keys } from 'ramda';
import type { AuthSessionStorage as RemixAuthSessionStorage } from '~/shared/remixjs/server';
import {
  Session,
  SessionStorage,
  createSessionStorage,
  redirect,
  SessionData,
  SessionIdStorageStrategy,
  FlashDataKey,
} from '~/overrides/remix';
import { ToRequiredKeys } from '~/shared/typescript-utilities';

export class AuthSessionStorage<Data extends SessionData = SessionData>
  implements Omit<RemixAuthSessionStorage<Data>, 'cookieKey' | 'guard'>
{
  protected cookieKey: string = 'clientId';
  private _loginUrl: string;
  private _keyInLocalStorage: string;
  private _storage: SessionStorage<Data, Data>;

  constructor({ loginUrl = '/login', options }: { loginUrl?: string; options?: SessionIdStorageStrategy['cookie'] }) {
    this._loginUrl = loginUrl;
    this._keyInLocalStorage = options?.name ?? this.cookieKey;
    this._storage = createSessionStorage<Data>(this._keyInLocalStorage);
  }

  public getSession: RemixAuthSessionStorage<Data>['getSession'] = () => {
    return this._storage.getSession();
  };

  public commitSessionAsCookieValue: RemixAuthSessionStorage<Data>['commitSessionAsCookieValue'] = async session => {
    const value = await this._storage.commitSession(session);
    return value;
  };

  public commitSessionAsHeaders: RemixAuthSessionStorage<Data>['commitSessionAsHeaders'] = session => {
    this._storage.commitSession(session);
    return Promise.resolve(new Headers());
  };

  public destroySession: RemixAuthSessionStorage<Data>['destroySession'] = async ({
    request,
    redirectUrl = loginUrl => loginUrl,
  }) => {
    const session = await this.getSession(request);
    return redirect(redirectUrl(this._loginUrl), {
      headers: {
        'Set-Cookie': await this._storage.destroySession(session),
      },
    });
  };

  public createSession: RemixAuthSessionStorage<Data>['createSession'] = async ({
    request,
    redirectTo,
    sessionData,
    remember,
  }) => {
    const session = await this.getSession(request);
    keys(sessionData).forEach(key => {
      const key_ = key.toString();
      session.set(key_, sessionData[key_]);
    });
    await this._storage.commitSession(session, {
      maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
    });
    return redirect(redirectTo);
  };

  public guard = async ({
    request,
    condition = (): boolean => true,
  }: {
    request: Request;
    condition?: (session: Session<Data, Data>) => boolean;
  }): Promise<
    Omit<Session<Data, Data>, 'data'> & {
      data: ToRequiredKeys<
        Session<Data, Data>['data'],
        Exclude<keyof Session<Data, Data>['data'], FlashDataKey<string>>
      >;
    }
  > => {
    const session = await this.getSession(request);
    const { pathname } = new URL(request.url);

    if (isEmpty(session.data) || !condition(session)) {
      const searchParams = new URLSearchParams([['redirectTo', pathname]]);
      throw redirect(`${this._loginUrl}?${searchParams}`);
    } else {
      return session as Omit<Session<Data, Data>, 'data'> & {
        data: ToRequiredKeys<
          Session<Data, Data>['data'],
          Exclude<keyof Session<Data, Data>['data'], FlashDataKey<string>>
        >;
      };
    }
  };
}
