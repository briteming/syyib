import { GithubIssue } from "@/interfaces/GithubIssue";
export const issues: GithubIssue[] = [
  {
    id: 1,
    title: "Fix authentication issue",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    comments_url: "https://api.github.com/issues/1/comments",
    updated_at: "2024-04-07T10:00:00Z",
    state: "open",
  },
  {
    id: 2,
    title: "Update user profile page",
    body: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    comments_url: "https://api.github.com/issues/2/comments",
    updated_at: "2024-04-06T15:30:00Z",
    state: "closed",
  },
  {
    id: 3,
    title: "Add dark mode feature",
    body: "Nullam id dolor id nibh ultricies vehicula ut id elit.",
    comments_url: "https://api.github.com/issues/3/comments",
    updated_at: "2024-04-05T08:45:00Z",
    state: "in progress",
  },
  {
    id: 4,
    title: "Refactor data fetching logic",
    body: "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
    comments_url: "https://api.github.com/issues/4/comments",
    updated_at: "2024-04-04T11:20:00Z",
    state: "Pending Review",
  },
  {
    id: 5,
    title: "Fix layout issues on mobile devices",
    body: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.",
    comments_url: "https://api.github.com/issues/5/comments",
    updated_at: "2024-04-03T16:10:00Z",
    state: "closed",
  },
];
