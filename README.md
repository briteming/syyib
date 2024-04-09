# Github Issue Blog

使用 Next.js 搭配 NextUI UI Framework，設計一個串接 Github Issue 的部落格專案，功能包括實施 Oauth 登入 Github，查詢使用者 Repo 對應的所有 Issue 列表、Issue 個別的 Comments，以及新增、修改、Lock Issue。在顯示所有 Issue 時也實做了無限滾動功能。

## 如何使用

### live demo

https://issue-blog-eight.vercel.app/

### local 環境

step1: Install dependencies

```bash
npm install
```

step1: 在.env 輸入你的 Github Client ID 和 Github Client secrets

- 因為在使用 web 實施獲取 Github Oauth 時，Github 簽章規定一定要有 Client 端的 Client ID 和 Client secrets
  可參考
  https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow

- Github 獲取 Client ID 和 Client secrets 位置 https://github.com/settings/developers
  ，請點選 OAuth Apps -> New OAuth App 進行 Create

```bash
***.env***
GITHUB_ID=你的Client ID
GITHUB_SECRET=你的Client secrets
```

Run the development server

```bash
npm npm run dev
```

若要操作 Upsert or Lock Issue，需輸入 Fine-grained personal access tokens

- Github 獲取 Fine-grained personal access tokens 位置在 https://github.com/settings/tokens?type=beta
  ，請點選 Generate new token -> 點選 Repository access 的 Only select repositories 選擇你要開啟權限的專案 -> Permissions 有個 Issues 把它設 Read and write -> Generate token -> 複製 token 貼到 Management 的 Add Fine Grained Token 即可在網頁操作

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
