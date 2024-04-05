'use client'

import { title } from "@/components/primitives";
import { Button } from "@nextui-org/react";

export default function LoginPage() {
	const handleLogin = () => {
		const client_id = '';
		const redirect_uri = '';
		const scope = 'read:user user:email';
		window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
	  };
	return (
		<div>
			<h1 className={title()}>Login</h1>
			<Button onClick={handleLogin}>Login</Button>
		</div>
	);
}
