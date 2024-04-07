"use client";
import { title } from "@/components/primitives";
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, getKeyValue } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { Octokit } from "octokit";

export interface GithubIssue {
  id: number;
  title: string;
  body: string | null;
  comments_url: string;
  updated_at: string;
  state: string;
}

const octokit = new Octokit({});
const username = 'Shih-Yang-Young';
const repoName = 'issue-blog';
const perPage = 10;
export default function Browse() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(false); // init true, cause need to load first data
  const list = useAsyncList<GithubIssue>({
    async load({ signal, cursor }) {
      if(!cursor){
        cursor = '1';
      }else{
        cursor = String(Number(cursor) + 1);
      }
      setIsLoading(true);
      const response = await octokit.rest.issues.listForRepo({
        owner: username,
        repo: repoName,
        per_page: perPage,
        page: Number(cursor),
      });
      console.log("i am ", response.data.length);
      const githubIssues: GithubIssue[] = response.data.map((issue: any) => ({
        id: issue.id,
        title: issue.title,
        body: issue.body || null,
        comments_url: issue.comments_url,
        updated_at: issue.updated_at,
        state: issue.state,
      }));
      if(response.data.length < perPage){
        setHasMore(false);
      }else{
        setHasMore(true);
      }
      setIsLoading(false);
      return { items: githubIssues, cursor: cursor.toString() }; 
    },
  });
  
  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  });
  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <span className={`${title({ size: "sm", color: "violet" })} lg:text-2xl`}>{username}&nbsp;</span>
      </section>
      <Table
        isHeaderSticky
        aria-label="Example table with infinite pagination"
        baseRef={scrollerRef}
        bottomContent={hasMore ? (
          <div className="flex w-full justify-center">
            <Spinner ref={loaderRef} color="white" />
          </div>
        ) : null}
        classNames={{
          base: "max-h-[500px]",
          table: "min-h-[500px]",
        }}
        onRowAction={(key) => alert(`Opening item ${key}...`)}
      >
        <TableHeader>
          <TableColumn key="id">Id</TableColumn>
          <TableColumn key="title">Title</TableColumn>
          <TableColumn key="body">Body</TableColumn>
          <TableColumn key="updated_at">Updated At</TableColumn>
          <TableColumn key="state">State</TableColumn>
          <TableColumn key="comments">Comments</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner color="white" />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}