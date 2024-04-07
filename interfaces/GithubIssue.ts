export interface GithubIssue {
  id: number;
  title: string;
  body: string | null;
  comments_url: string;
  updated_at: string;
  state: string;
  locked: boolean;
}
