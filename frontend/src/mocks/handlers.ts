import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('api/posts', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Next.js入門',
        date: 'Mar 16, 2024',
        datetime: '2024-04-16',
        tag: 'Frontend',
        author: '田中一郎',
        heats: 10,
      },
      {
        id: 2,
        title: 'Flask入門',
        date: 'Mar 17, 2024',
        datetime: '2024-04-17',
        tag: 'Backend',
        author: '鈴木花子',
        heats: 10,
      },
      {
        id: 3,
        title: 'AWS CDK入門',
        date: 'Mar 18, 2024',
        datetime: '2024-04-18',
        tag: 'AWS',
        author: '佐藤ケンシロウ',
        heats: 10,
      },
      {
        id: 4,
        title: 'デザイン入門',
        date: 'Mar 18, 2024',
        datetime: '2024-04-18',
        tag: '宝塚',
        author: 'やすながまゆ',
        heats: 93,
      },
    ]);
  }),

  http.post('api/posts', () => {
    return HttpResponse.json();
  }),

  http.get('api/posts/1', () => {
    return HttpResponse.json({
      title: 'Next.js入門',
      article:
        "# Next.jsとは\n\nNext.jsは、**Reactベース**のフレームワークで、サーバーサイドレンダリング（SSR）や静的サイト生成（SSG）などの機能を提供します。\n\n# 主な特徴\n\n1. サーバーサイドレンダリング(SSR)\n2. 静的サイト生成(SSG)\n3. App Route\n\n# サンプルコード\n\n```tsx\nimport Head from 'next/head';\n\nexport default function Home() {\n  return (\n    <div>\n      <Head>\n        <title>My Next.js App</title>\n      </Head>\n      <main>\n        <h1>Welcome to Next.js!</h1>\n      </main>\n    </div>\n  );\n}\n```",
      tag: 'Frontend',
      userId: 'xxx',
    });
  }),

  http.get('api/posts/2', () => {
    return HttpResponse.json({
      title: 'Flask入門',
      article:
        "# Flaskとは\n\nFlaskはPythonで書かれたWebフレームワークでフロントエンド、APIサーバーの両方の機能を兼ね備えているフレームワークです\n\n# 主な特徴\n1. シンプルで軽量\n2. 拡張機能で機能追加が可能\n3. Jinja2によるテンプレートエンジンの提供\n\n# サンプルコード\n```py\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route('/')\ndef hello_world():\n    return 'Hello, World!'\n\nif __name__ == '__main__':\n    app.run()\n```",
      tag: 'Backend',
    });
  }),

  http.put('api/posts/1', () => {
    return HttpResponse.json();
  }),

  http.delete('api/posts/1', () => {
    return HttpResponse.json();
  }),

  http.post('api/signup', () => {
    return HttpResponse.json();
  }),

  http.post('api/signin', () => {
    return HttpResponse.json({
      token: 'xxxx.yyyy.zzzz',
      userId: 'xxx',
      userName: 'みねぎし そういちろう',
    });
  }),
];
