'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MouseEventHandler, useEffect, useState } from 'react';
import '../../styles/markdown.css';
import useSWRMutation from 'swr/mutation';
import { redirect, useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { authState, userState } from '../state';
import MessageDialog from '../../components/Modatal';

type FormInput = {
  title: string;
  article: string;
  tag: string;
};

type Props = {
  params: { id: string };
};

export default function Detail(props: Props) {
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
  } = useForm<FormInput>({
    defaultValues: async () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${props.params.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }).then(async (res) => {
        const data = await res.json();
        setIsSelf(user.id == data.userId);
        return {
          title: data.title,
          article: data.article,
          tag: data.tag,
        };
      }),
  });

  const router = useRouter();
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const user = useRecoilValue(userState);
  const [isSelf, setIsSelf] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const fetcher = async (url: string, { arg }: { arg: FormInput }) =>
    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arg),
    });

  const { trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${props.params.id}`,
    fetcher,
    {},
  );

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    trigger(data).then((_) => {
      router.push('/');
    });
  };

  const onClickPreview: MouseEventHandler<HTMLButtonElement> = () =>
    setIsPreview(!isPreview);

  // 削除APIを実行する
  const deleteFetcher = async (url: string, { arg }: { arg: undefined }) =>
    await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
    });

  const { trigger: triggerDelete } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${props.params.id}`,
    deleteFetcher,
    {},
  );

  const onClickDelete: MouseEventHandler<HTMLButtonElement> = () =>
    setIsOpenDialog(true);

  const onSubmitDelete = () => {
    triggerDelete().then(() => {
      router.push('/');
    });
  };

  return (
    <main>
      <MessageDialog
        title="確認"
        message="本当に削除しますか？"
        open={isOpenDialog}
        onPositive={() => onSubmitDelete()}
        onNegative={() => {
          setIsOpenDialog(false);
        }}
        labelPositive="削除する"
      />

      <div className="mx-auto max-w-4xl px-4 pt-10">
        <div className="flex h-20 justify-between">
          <div className="flex w-9/12 items-center">
            <label className="mr-4 text-xl font-semibold">タイトル</label>
            <input
              disabled={!isSelf}
              className="h-10 w-9/12 border-gray-50 px-1"
              {...register('title')}
            />
          </div>
          {isSelf && (
            <div className="flex items-center justify-center">
              <button
                className="h-10 rounded-lg bg-red-300 px-4 hover:bg-red-400"
                onClick={onClickDelete}
              >
                削除
              </button>
              <button
                className={`my-auto ml-2 h-10 rounded-lg ${isPreview ? 'bg-orange-300' : 'bg-slate-300'} px-4 hover:bg-slate-400`}
                onClick={onClickPreview}
              >
                プレビュー
              </button>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isPreview || !isSelf ? (
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
            <div>
              <label>タグ</label>
              <select
                disabled={!isSelf}
                className="ml-4 rounded-lg border border-gray-300 bg-gray-50"
                {...register('tag')}
              >
                <option>Frontend</option>
                <option>Backend</option>
                <option>AWS</option>
              </select>
            </div>
            {isSelf && (
              <button
                disabled={!isSelf}
                className="h-10 rounded-lg bg-blue-300 px-4 hover:bg-blue-400"
              >
                投稿
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
