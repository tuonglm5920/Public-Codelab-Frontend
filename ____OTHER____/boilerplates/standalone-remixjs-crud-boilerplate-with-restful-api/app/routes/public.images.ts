import { LoaderFunction } from '@remix-run/node';
import { sharpLoader } from '~/shared/remixjs/server';

export const loader: LoaderFunction = sharpLoader;
