'use client';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useRecoilState } from 'recoil';
import useSWR from 'swr';
import { authState, userState } from './state';
import { useEffect } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Home() {
  const [auth, setAuth] = useRecoilState(authState);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (!auth.token) {
      redirect('/login');
    }
  }, [auth]);

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (res.status === 401) {
      setAuth({ token: '' });
      setUser({ id: '', name: '' });
      redirect('/login');
    }
    return res.json();
  };

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts`,
    fetcher,
    {
      fallbackData: [],
      onError: (error) => {
        if (error.message === 'Unauthorized') {
          console.log('Unauthorized access, redirecting to login');
        }
      }
    },
  );

  return (
    <main>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mt-10 grid max-w-2xl gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2">
          {data.map((post: any) => (
            <button
              key={post.id}
              className="flex flex-col bg-blue-100 py-1 pl-2"
            >
              <div className="mt-3 text-lg font-semibold">
                <Link href={`${post.id}`}>{post.title}</Link>
              </div>
              <div className="flex items-center gap-x-2 text-xs">
                <div className="">{post.author}</div>
                <time dateTime={post.datetime} className="text-gray-500">
                  {post.date}
                </time>
                <div className="ml-2 rounded-full bg-gray-50 px-3 py-1 font-medium text-gray-600">
                  {post.tag}
                </div>
                <div className="flex items-center gap-x-1">
                  <HeartIcon className="h-5 w-5 fill-none stroke-red-500" />
                  <div className="text-gray-500">{post.heats}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
