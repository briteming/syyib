"use client";

import { title } from "@/components/primitives";
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, getKeyValue} from "@nextui-org/react";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useAsyncList} from "@react-stately/data";

export interface GithubIssue {
	id: number;
	title: string;
	body: string | null;
	comments_url: string;
	updated_at: string;
	state: string;
}
const username = 'Shih-Yang-Young';
const repoName = 'issue-blog';
async function fetchGithubData(cursor?: string | null): Promise<{ items: GithubIssue[], cursor: string | null }> {
	const res = await fetch(cursor || `https://api.github.com/repos/${username}/${repoName}/issues`);
	const json = await res.json();
	const githubIssues: GithubIssue[] = json.map((issue: any) => ({
		id: issue.id,
		title: issue.title,
		body: issue.body || null,
		comments_url: issue.comments_url,
		updated_at: issue.updated_at,
		state: issue.state,
	}));
	return {
		items: githubIssues,
		cursor: json.next,
	};
}
export default function Browse() {
	const [isLoading, setIsLoading] = React.useState(true);
	const [hasMore, setHasMore] = React.useState(false);
	const [loadedCount, setLoadedCount] = React.useState(0);
	const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");

	let list = useAsyncList<GithubIssue>({
		async load({ signal, cursor }) {
		  if (cursor) {
			setIsLoading(false);
		  }
	  
		  const { items, cursor: nextCursor } = await fetchGithubData(cursor);
		  setHasMore(nextCursor !== null);
		  return { items, cursor: nextCursor || undefined }; // Adjust cursor type here
		},
	  });

	const [loaderRef, scrollerRef] = useInfiniteScroll({hasMore, onLoadMore: list.loadMore});	
	return (
		<div>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<span className={`${title({size:"sm", color: "violet" })} lg:text-2xl`} >{username}&nbsp;</span>
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
					base: "max-h-[300px]",
					table: "min-h-[300px]",
				}}
				onRowAction={(key) => alert(`Opening item ${key}...`)}
			>
			<TableHeader>
				<TableColumn key="id">Id</TableColumn>
				<TableColumn key="title">Title</TableColumn>
				<TableColumn key="body">Body</TableColumn>
				<TableColumn key="updated_at">Updated At</TableColumn>
				<TableColumn key="state">state</TableColumn>
				<TableColumn key="comments">Comments</TableColumn>
			</TableHeader>
			<TableBody
				isLoading={isLoading}
				items={list.items}
				loadingContent={<Spinner color="white" />}
			>
				{(item) => (
				<TableRow key={item.name}>
					{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
				</TableRow>
				)}
			</TableBody>
			</Table>
		</div>
	);
}
