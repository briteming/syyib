"use client";
import { title } from "@/components/primitives";
import { useSession } from "next-auth/react";
export default function Management() {
  const { data: session } = useSession();
  if(session){
	return (
	<div>
		<h1 className={title()}>Management</h1>
	</div>
	);
  }
  return (
	<div>
	  <h1 className={title()}>plz login first</h1>
	</div>
  );
}
