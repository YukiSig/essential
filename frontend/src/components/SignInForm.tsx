'use client';
import { authState, userState } from '@/app/state';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import useSWRMutation from 'swr/mutation';

type Props = {
  changeForm: () => void;
};

type FormInput = {
  email: string;
  password: string;
};

export default function SignInForm(props: Props) {
  const { register, handleSubmit } = useForm<FormInput>();
  const router = useRouter();

  const [auth, setAuth] = useRecoilState(authState);
  const [user, setUser] = useRecoilState(userState);

  const fetcher = async (url: string, { arg }: { arg: FormInput }) =>
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arg),
    });
  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/signin`,
    fetcher,
    {},
  );

  const onSubmit: SubmitHandler<FormInput> = (req) => {
    trigger(req).then(async (res) => {
      const data = await res.json();
      setAuth({ token: data!.token });
      setUser({ id: data!.userId, name: data!.userName });
      router.push('/');
    });
  };

  return (
    <div className="flex flex-col items-center  bg-zinc-50 pb-6 pt-12">
      <div className="mx-auto pb-8 text-center">
        <div className="pb-4 text-4xl font-bold">Mini Zenn🍻</div>
        <div>メールアドレスとパスワードを入力してログインしてください</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <div className="pb-2">
            <label className="text-sm text-gray-600">メールアドレス</label>
            <div>
              <input
                type="email"
                autoComplete="email"
                required
                className="rounded-md"
                {...register('email')}
              />
            </div>
          </div>
          <div className="pb-4">
            <label className="text-sm text-gray-600">パスワード</label>
            <div>
              <input
                type="password"
                autoComplete="email"
                required
                className="rounded-md"
                {...register('password')}
              />
            </div>
          </div>
          <button className="rounded-lg bg-blue-300 hover:bg-blue-400">
            ログイン
          </button>
          <span className="pt-2 hover:underline" onClick={props.changeForm}>
            アカウント作成はこちら
          </span>
        </div>
      </form>
    </div>
  );
}
