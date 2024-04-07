"use client";
import { title } from "@/components/primitives";
import React from "react";
import { useSession } from "next-auth/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue} from "@nextui-org/react";
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";
import {EyeIcon} from "./EyeIcon";
import { users} from "./data";
import { columns } from "@/components/table";
const statusColorMap = {
	active: "success",
	paused: "danger",
	vacation: "warning",
  };

export default function Management() {
  const { data: session } = useSession();
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: user.avatar}}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
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
		<TableBody items={users}>
		{(item) => (
			<TableRow key={item.id}>
			{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
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
