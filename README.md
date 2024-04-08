# Github Issue Blog

使用 Next.js 搭配 NextUI UI Framework，設計一個串接 Github Issue 的部落格專案，功能包括實施 Oauth 登入 Github，查詢使用者 Repo 對應的所有 Issue 列表、Issue 個別的 Comments，以及新增、修改、Lock Issue。在顯示所有 Issue 時也實做了無限滾動功能。

## 使用技術

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Github Oauth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow)
- [Github Octokit](https://octokit.github.io/rest.js/v20)
- [NextAuth.js](https://next-auth.js.org/)
- [vercel](hhttps://vercel.com/)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/nextui-org/next-app-template
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
