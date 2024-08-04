import { redirect } from '@remix-run/server-runtime';

export const loader = async () => redirect('/dashboard');

const Index = () => {
  return null;
};

export default Index;
