import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const token = (await cookies()).get('jb_token')?.value;
  redirect(token ? '/jobs' : '/register');
}
