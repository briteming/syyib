"use client";
import { title } from "@/components/primitives";
import React from "react";
import { useSession } from "next-auth/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue} from "@nextui-org/react";
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";
import {EyeIcon} from "./EyeIcon";
import { issues } from "./data";
import { columns } from "@/composables/table";
const stateColorMap = {
	open: "success",
	closed: "danger",
	"in progress": "warning",
  };

export default function Management() {
  const { data: session } = useSession();
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
  if(session){
	return (
	<div>
	  <h1 className={title()}>Management</h1>
	<Table 
		aria-label="Example table with custom cells"
		classNames={{
			base: "w-full",
			table: "min-h-[500px] max-w-5xl",
		}}
	>
		<TableHeader columns={columns}>
		{(column) => (
			<TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
			{column.name}
			</TableColumn>
		)}
		</TableHeader>
		<TableBody items={issues}>
		{(issue) => (
			<TableRow key={issue.id}>
			{(columnKey) => <TableCell>{renderCell(issue, columnKey)}</TableCell>}
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
