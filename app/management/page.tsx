"use client";
import { title } from "@/components/primitives";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Chip,
  Card,
  CardBody,
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { managementColumns } from "@/composables/table";
import { useAsyncList } from "@react-stately/data";
import { GithubIssue } from "@/interfaces/GithubIssue";
import { Octokit } from "octokit";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { toast } from "react-hot-toast";
import AddIssueModal from "@/components/addIssueModal";
import DeleteIssueModal from "@/components/deleteIssueModal";
import EditIssueModal from "@/components/editIssueModal";
import CommentsModal from "@/components/commentsModal";
import AddTokenModal from "@/components/addFineGrainedToken";

// const username = "Shih-Yang-Young";
// const repoName = "issue-blog";

interface Repo {
  repoName: string;
}

const perPage = 10;
export default function Management() {
  /** define state*/
  const [username, setUsername] = React.useState("");
  const [repoName, setRepoName] = React.useState("");
  const { data: session } = useSession();
  const accessToken = (session as any)?.access_token;
  const octokit = new Octokit({auth: accessToken});

  /** fineGrainedAccessToken */
  useEffect(() => {
    if (sessionStorage.getItem("fineGrainedAccessToken") == null &&
     sessionStorage.getItem("toggle") == null) {
      toast('add fine grained token to manipulate issue !!', {
        style: { background: "#F57512", color: "white" },
        position: "top-center",
        duration: 8000,
      });
      sessionStorage.setItem("toggle", "true");
    }
  }, []);

  /** step1: check session available then call getGitHubLoginName to username */
  useEffect(() => {
    async function fetchUsername() {
      const loginName = await getGitHubLoginName();
      if (loginName) {
        setUsername(loginName);
      }
    }
    if (session) {
      console.log('Session is available');
      fetchUsername();
    }
  }, [session]);

  useEffect(() => {
    async function fetchRepos() {
      const response = await octokit.request(`GET /users/${username}/repos`, {
        username: username,
        type: 'public',
      });
      if (response.status === 200) {
        const repos: Repo[] = response.data.map((repo: any) => ({ repoName: repo.name }));
        if (repos.length > 0) {
          setRepoName(repos[0].repoName); // Set the first repo name as repoName
        }
      } else {
        console.error('Failed to fetch GitHub repos:', response);
      }
    }
  
    if (username) {
      console.log('Username is available');
      fetchRepos();
      repos.reload();
    }
  }, [username]);
  
  useEffect(() => {
    async function loadData() {
      // Load data using username and repoName
      list.reload();
    }
  
    if (username && repoName) {
      console.log('Loading data...');
      loadData();
    }
  }, [username, repoName]);

  async function getGitHubLoginName() {
    if(!accessToken){
      return ;
    }
    try {
      const response = await octokit.request("/user");
      if (response.status === 200) {
        return response.data.login;
      } else {
        console.error('Failed to fetch GitHub profile:', response);
        return null;
      }
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
      return null;
    }
  }
  
  let repos = useAsyncList<Repo>({
    async load({ signal }) {
      try {
        if (!username) {
          return {items: []}
        }
        const response = await octokit.request(`GET /users/${username}/repos`, {
          username: username,
          type: 'public',
        });
        if (response.status === 200) {
          const repos: Repo[] = response.data.map((repo: any) => ({ repoName: repo.name }));
          return {items: repos}
        } else {
          console.error('Failed to fetch GitHub repos:', response);
          return {items: []}
        }
      } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        return {items: []}
      }
    }
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(false);
  const list = useAsyncList<GithubIssue>({
    async load({ signal, cursor }) {
      if (!username) {
          return {items: []}
      }
      if (!cursor) {
        cursor = "1";
      } else {
        cursor = String(Number(cursor) + 1);
      }
      setIsLoading(true);
      const randomParam = Math.random().toString(36).substring(7);
      const response = await octokit.rest.issues.listForRepo({
        url: `https://api.github.com/repos/${username}/${repoName}/issues?random=${randomParam}`,
        owner: username,
        repo: repoName,
        per_page: perPage,
        page: Number(cursor),
      });
      const githubIssues: GithubIssue[] = response.data.map((issue: any) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body || null,
        comments_url: issue.comments_url,
        updated_at: issue.updated_at,
        state: issue.state,
        locked: issue.locked,
      }));
      const unlockedIssues = githubIssues.filter(
        (issue) => issue.locked === false,
      );
      if (response.data.length < perPage) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setIsLoading(false);
      return { items: unlockedIssues, cursor: cursor.toString() };
    },
  });
  const handleModalSuccess = () => {
    list.reload();
  };
  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  });
  const renderCell = React.useCallback((issue: any, columnKey: any) => {
    const cellValue = issue[columnKey];
    switch (columnKey) {
      case "state":
        return (
          <Chip className="capitalize" color="default" size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <CommentsModal issueNumber={issue.number} />
            <EditIssueModal
              issueNumber={issue.number}
              onResponse={handleModalSuccess}
            />
            <DeleteIssueModal
              issueNumber={issue.number}
              onResponse={handleModalSuccess}
            />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (session) {
    return (
      <div>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <Card>
            <CardBody>
              <div className="w-full flex flex-col gap-4">
                <div key="lg" className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input 
                    size="lg"  
                    type="text" 
                    label="Username" 
                    labelPlacement="outside-left" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    readOnly={true}
                  />
                  <Autocomplete
                    items={repos.items}
                    defaultInputValue={"issue-blog"}
                    labelPlacement="outside-left"
                    label="Repo"
                    className="max-w-xs"
                    onSelectionChange={(selectRepo) => {
                      setRepoName(selectRepo.toString());
                    }}
                  >
                    {(repo) => <AutocompleteItem key={repo.repoName}>{repo.repoName}</AutocompleteItem>}
                  </Autocomplete>
                </div>
              </div> 
            </CardBody>
          </Card>
        </section>
        <div className="flex items-center justify-between my-4">
          <AddTokenModal />
          <h1 className={title()}>Management</h1>
          <AddIssueModal onResponse={handleModalSuccess} issueNumber={0} />
        </div>
        <Table
          isHeaderSticky
          aria-label="Example table with custom cells"
          baseRef={scrollerRef}
          classNames={{
            base: "max-h-[500px]",
            table: "min-h-[500px]",
          }}
          bottomContent={
            hasMore ? (
              <div className="flex w-full justify-center">
                <Spinner ref={loaderRef} color="white" />
              </div>
            ) : null
          }
        >
          <TableHeader columns={managementColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={list.items}
            loadingContent={<Spinner color="white" />}
          >
            {(issue) => (
              <TableRow key={issue.number}>
                {(columnKey) => (
                  <TableCell>{renderCell(issue, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
  return (
    <div>
      <h1 className={title()}>plz login first</h1>
    </div>
  );
}
