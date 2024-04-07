"use client";
import { title } from "@/components/primitives";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Chip, Tooltip, getKeyValue, Textarea} from "@nextui-org/react";
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";
import {EyeIcon} from "./EyeIcon";
import { managementColumns } from "@/composables/table";
import { useAsyncList } from "@react-stately/data";
import { GithubIssue } from "@/interfaces/GithubIssue";
import { Octokit } from "octokit";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { toast } from 'react-hot-toast';

const stateColorMap = {
	open: "success",
	closed: "danger",
	"in progress": "warning",
  };
const username = 'Shih-Yang-Young';
const repoName = 'issue-blog';
const perPage = 10;


export default function Management() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.access_token;
  const octokit = new Octokit({ auth: `${accessToken}` });
  console.log("accessToken",accessToken );
  const addIssueOctokit = new Octokit({ auth:`` });
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(false);
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
  const renderCell = React.useCallback((issue, columnKey) => {
    const cellValue = issue[columnKey];
    switch (columnKey) {
      case "state":
        return (
          <Chip className="capitalize" color={stateColorMap[issue.state]} size="sm" variant="flat">
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
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
  const [issueTitle, setIssueTitle] = useState('');
  const [issueBody, setIssueBody] = useState('');
  const addIssue = async () => {
	try {
	  const response = await addIssueOctokit.request(`POST /repos/${username}/${repoName}/issues`, {
		owner: username,
		repo: repoName,
		title: issueTitle,
		body: issueBody,
		headers: {
		  'X-GitHub-Api-Version': '2022-11-28'
		}
	  });
	  console.log("response", response);
	  toast.success('add issue success!', {style: {background: 'green',color:"white"},position:"top-center"});
	  onClose();
	} catch (error) {
	  console.error('Error creating issue:', error);
	  toast.error('add issue error', {style: {background: 'red',color:"white"},position:"top-center"});
	}
  }
  const handleButtonClick = () => {
    
  };
  if(session){
	return (
	<div>
	  <h1 className={title()}>Management</h1>
	  <Button onPress={onOpen} color="primary">Add Issue</Button>
	<Table 
		isHeaderSticky
		aria-label="Example table with custom cells"
		baseRef={scrollerRef}
		classNames={{
			base: "max-h-[500px]",
          	table: "min-h-[500px]",
		}}
		bottomContent={hasMore ? (
		<div className="flex w-full justify-center">
			<Spinner ref={loaderRef} color="white" />
		</div>
		) : null}
	>
		<TableHeader columns={managementColumns}>
		{(column) => (
			<TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
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
			<TableRow key={issue.id}>
			{(columnKey) => <TableCell>{renderCell(issue, columnKey)}</TableCell>}
			</TableRow>
		)}
		</TableBody>
	</Table>
	<Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New Issue</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="title"
                  placeholder="Enter your title"
                  variant="bordered"
				  required
				  value={issueTitle}
				  onChange={(e) => setIssueTitle(e.target.value)}
                />
                <Textarea
                  label="body"
                  placeholder="Enter your body"
                  variant="bordered"
				  size="lg"
				  value={issueBody}
                  onChange={(e) => setIssueBody(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={addIssue}>
                  Add New Issue
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
