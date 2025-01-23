'use client';

import { MouseEventHandler, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../../styles/markdown.css';
import { redirect, useRouter } from 'next/navigation';
import useSWRMutation from 'swr/mutation';
import { useRecoilValue } from 'recoil';
import { authState } from '../state';

type FormInput = {
  title: string;
  article: string;
  tag: string;
};

export default function New() {
  const auth = useRecoilValue(authState);
  useEffect(() => {
    if (!auth.token) {
      redirect('/login');
    }
  }, [auth]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormInput>();
  const router = useRouter();

  const [isPreview, setIsPreview] = useState<boolean>(false);

  const fetcher = async (url: string, { arg }: { arg: FormInput }) =>
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arg),
    });

  const { trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/posts`,
    fetcher,
    {},
  );

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    // console.log(data);
    trigger(data).then((_) => {
      router.push('/');
    });
  };

  const onClickPreview: MouseEventHandler<HTMLButtonElement> = () => {
    setIsPreview(!isPreview);
  };

  return (
    <main>
      <div className="mx-auto max-w-4xl px-4 pt-10">
        <div className="flex h-20 justify-between">
          <div className="flex w-9/12 items-center">
            <label className="mr-4 text-xl font-semibold">タイトル</label>
            <input
              className="h-10 w-9/12 border-gray-50 px-1"
              {...register('title')}
            />
          </div>
          <button
            className={`my-auto h-10 rounded-lg ${isPreview ? 'bg-orange-300' : 'bg-slate-300'} px-4 hover:bg-slate-400`}
            onClick={onClickPreview}
          >
            プレビュー
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isPreview ? (
            <Markdown
              className="markdown min-h-60 w-full bg-white px-4 py-1"
              remarkPlugins={[remarkGfm]}
            >
              {getValues('article')}
            </Markdown>
          ) : (
            <textarea
              className="min-h-60 w-full px-1"
              {...register('article')}
            />
          )}
          <div className="flex h-12 items-center justify-between py-4">
            <label>タグ</label>
            <select
              className="ml-4 rounded-lg border border-gray-300 bg-gray-50"
              {...register('tag')}
            >
              <option>Frontend</option>
              <option>Backend</option>
              <option>AWS</option>
            </select>
          </div>
          <button className="h-10 rounded-lg bg-blue-300 px-4 hover:bg-blue-400">
            投稿
          </button>
        </form>
      </div>
    </main>
  );
}
