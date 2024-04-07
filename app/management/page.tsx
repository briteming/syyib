"use client";
import { title } from "@/components/primitives";
import React, { useState } from "react";
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
  Tooltip,
  getKeyValue,
  Textarea,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { managementColumns } from "@/composables/table";
import { useAsyncList } from "@react-stately/data";
import { GithubIssue } from "@/interfaces/GithubIssue";
import { Octokit } from "octokit";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import AddIssueModal from "@/components/addIssueModal";

const stateColorMap = {
  open: "success",
  closed: "danger",
  "in progress": "warning",
};
const username = "Shih-Yang-Young";
const repoName = "issue-blog";
const perPage = 10;

export default function Management() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.access_token;
  const octokit = new Octokit();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(false);
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
        owner: username,
        repo: repoName,
        per_page: perPage,
        page: Number(cursor),
        url: `https://api.github.com/repos/Shih-Yang-Young/issue-blog/issues?random=${randomParam}`,
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
      const unlockedIssues = githubIssues.filter(issue => issue.locked === false);
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
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const [deleteIssueNumber, setDeleteIssueNumber] = useState(0);
  const deleteDialog = (id: number) =>{
    onOpen();
    setDeleteIssueNumber(id);
  }
  const deleteIssue = async () => {
    try {
      const deleteIssueOctokit = new Octokit({ auth: `` });
      const response = await deleteIssueOctokit.request(
        `PUT /repos/Shih-Yang-Young/issue-blog/issues/${deleteIssueNumber}/lock`,
        {
          owner: "Shih-Yang-Young",
          repo: "issue-blog",
          issue_number: deleteIssueNumber,
          lock_reason : 'off-topic',
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );
      toast.success("delete issue success!", {
        style: { background: "green", color: "white" },
        position: "top-center",
      });
      list.reload();
      onClose();
    } catch (error) {
      console.error("Error creating issue:", error);
      toast.error("delete issue error", {
        style: { background: "red", color: "white" },
        position: "top-center",
      });
    }
  };
  const renderCell = React.useCallback((issue, columnKey) => {
    const cellValue = issue[columnKey];
    switch (columnKey) {
      case "state":
        return (
          <Chip
            className="capitalize"
            color={stateColorMap[issue.state]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => deleteDialog(issue.number)}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (session) {
    return (
      <div>
        <div className="flex items-center justify-between my-4">
          <h1 className={title()}>Management</h1>
          <AddIssueModal />
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
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col">
                  Are u sure delete {deleteIssueNumber}?
                </ModalHeader>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={deleteIssue}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }
  return (
    <div>
      <h1 className={title()}>plz login first</h1>
    </div>
  );
}
