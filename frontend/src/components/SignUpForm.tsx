'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';

type Props = {
  changeForm: () => void;
};

type FormInput = {
  userName: string;
  email: string;
  password: string;
};

export default function SignUpForm(props: Props) {
  const { register, handleSubmit } = useForm<FormInput>();

  const fetcher = async (url: string, { arg }: { arg: FormInput }) =>
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arg),
    });
  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/signup`,
    fetcher,
    {},
  );
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    trigger(data).then((_) => props.changeForm());
  };

  return (
    <div className="flex flex-col items-center bg-zinc-50 pb-6 pt-12">
      <div className="mx-auto pb-8 text-center">
        <div className="pb-4 text-4xl font-bold">Mini Zenn🍻</div>
        <div>ユーザー名、メールアドレス、パスワードを入力してください</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <div className="pb-2">
            <label className="text-sm text-gray-600">ユーザー名</label>
            <div>
              <input
                type="text"
                required
                className="rounded-md"
                {...register('userName')}
              />
            </div>
          </div>
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
            アカウント作成
          </button>
          <span className="pt-2 hover:underline" onClick={props.changeForm}>
            ログインはこちら
          </span>
        </div>
      </form>
    </div>
  );
}
