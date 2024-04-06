"use client";

import { title } from "@/components/primitives";

import { Button } from "@nextui-org/react";

import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, getKeyValue} from "@nextui-org/react";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useAsyncList} from "@react-stately/data";

export interface GithubIssue {
	id: number;
	title: string;
	body: string | null;
	comments_url: string;
  }

export default function Home() {
	const [isLoading, setIsLoading] = React.useState(true);
	const [hasMore, setHasMore] = React.useState(false);
	const [loadedCount, setLoadedCount] = React.useState(0); // 记录已加载的数量
	const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");

	let list = useAsyncList({
	async load({signal, cursor}) {

		if (cursor) {
		setIsLoading(false);
		}

		// If no cursor is available, then we're loading the first page.
		// Otherwise, the cursor is the next URL to load, as returned from the previous page.
		const res = await fetch(cursor || "https://swapi.py4e.com/api/people/?search=", {signal});
		let json = await res.json();

		setHasMore(json.next !== null);

		return {
		items: json.results,
		cursor: json.next,
		};
	},
	});

	const [loaderRef, scrollerRef] = useInfiniteScroll({hasMore, onLoadMore: list.loadMore});
	
	const username = 'Shih-Yang-Young';
	const repoName = 'issue-blog';

	const fetchGithubData = async () => {
			fetch(`https://api.github.com/repos/${username}/${repoName}/issues`)
				.then(response => response.json())
				.then((issues: any[]) => {
				const githubIssues: GithubIssue[] = issues.map(issue => ({
					id: issue.id,
					title: issue.title,
					body: issue.body || null,
					comments_url: issue.comments_url,
				}));
				console.log(`Issues for ${repoName}:`, githubIssues);
				})
				.catch(error => {
				console.error(`Error fetching issues for ${repoName}:`, error);
				});
	};
	return (
		<div>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<div className={title({ color: "violet" })}>{username}&nbsp;</div>
				<br />
				<div className="inline-block max-w-lg text-center justify-center">
					<Button
						id="getUserData"
						className="bg-none border-gray-300 border py-2 px-6 rounded-md mb-2"
						onClick={fetchGithubData}
					>
						Get GitHub Data
					</Button>
				</div>
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
				base: "max-h-[300px] overflow-scroll",
				table: "min-h-[300px]",
			}}
			onRowAction={(key) => alert(`Opening item ${key}...`)}
			>
			<TableHeader>
				<TableColumn key="name">Name</TableColumn>
				<TableColumn key="height">Height</TableColumn>
				<TableColumn key="mass">Mass</TableColumn>
				<TableColumn key="birth_year">Birth year</TableColumn>
				<TableColumn key="button"><Button>aaa</Button></TableColumn>
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
