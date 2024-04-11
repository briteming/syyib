"use client";
import { title } from "@/components/primitives";
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Chip,
  Input,
  Card,
  CardBody,
  Button,
} from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { Octokit } from "octokit";
import { GithubIssue } from "@/interfaces/GithubIssue";
import { browseColumns } from "@/composables/table";
import CommentsModal from "@/components/commentsModal";

const octokit = new Octokit({});
const perPage = 10;
export default function Browse() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(false); // init true, cause need to load first data
  const [username, setUsername] = React.useState("Shih-Yang-Young");
  const [repoName, setRepoName] = React.useState("issue-blog");
  const [searchUsername, setSearchUsername] = React.useState("Shih-Yang-Young");
  const [searchRepoName, setSearchRepoName] = React.useState("issue-blog");
  useEffect(() => {
    list.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchRepoName, searchUsername]);
  const searchUserRepo = () => {
    setSearchUsername(username);
    setSearchRepoName(repoName);
  };
  const list = useAsyncList<GithubIssue>({
    async load({ signal, cursor }) {
      if (!cursor) {
        cursor = "1";
      } else {
        cursor = String(Number(cursor) + 1);
      }
      setIsLoading(true);
      const randomParam = Math.random().toString(36).substring(7);
      const response = await octokit.rest.issues.listForRepo({
        owner: searchUsername,
        repo: searchRepoName,
        per_page: perPage,
        page: Number(cursor),
        url: `https://api.github.com/repos/${searchUsername}/${searchRepoName}/issues?random=${randomParam}`,
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
      case "comments":
        return (
          <div className="relative flex items-center gap-2">
            <CommentsModal issueNumber={issue.number} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card>
          <CardBody>
            <div className="w-full flex flex-col gap-4">
              <div
                key="lg"
                className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
              >
                <Input
                  size="lg"
                  type="text"
                  label="Username"
                  labelPlacement="outside-left"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  size="lg"
                  type="text"
                  label="Repo"
                  labelPlacement="outside-left"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                />
                <Button
                  onPress={() => {
                    searchUserRepo();
                  }}
                >
                  search
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
      <Table
        isHeaderSticky
        aria-label="Example table with infinite pagination"
        baseRef={scrollerRef}
        bottomContent={
          hasMore ? (
            <div className="flex w-full justify-center">
              <Spinner ref={loaderRef} color="white" />
            </div>
          ) : null
        }
        classNames={{
          base: "max-h-[500px]",
          table: "min-h-[500px]",
        }}
      >
        <TableHeader columns={browseColumns}>
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
          {(item) => (
            <TableRow key={item.number}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
