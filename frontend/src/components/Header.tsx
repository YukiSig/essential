import { authState, userState } from '@/app/state';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';

export default function Header() {
  const user = useRecoilValue(userState);
  const auth = useRecoilValue(authState);

  return (
    <header>
      <div className="h-14 bg-orange-200">
        <div className="m-auto flex h-full max-w-7xl items-center justify-between">
          <div className="ml-8 font-sans text-2xl font-semibold">
            <Link href="/">Mini Zenn🍻</Link>
          </div>
          {auth.token && (
            <div className="flex items-center">
              <div className="mr-2 rounded-full bg-gray-50 px-4 py-2">
                {user.name}
              </div>
              <button className="mr-8 rounded-full bg-blue-500 px-4 py-2 text-center font-bold text-white hover:bg-blue-700">
                <Link href="/new">新規投稿</Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
