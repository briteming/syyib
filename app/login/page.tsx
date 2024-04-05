'use client'

import { title } from "@/components/primitives";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from 'react';

export default function LoginPage() {
	const [clientId, setClientId] = useState('');
	const [secret, setSecret] = useState('');
  
	const handleLogin = () => {
	  const redirect_uri = 'http://localhost:3000/login';
	  const scope = 'read:user user:email';
	  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&scope=${scope}`;
	};
  
	return (
	  <div>
		<div className="flex flex-col items-center gap-4">
		  <h1 className={title()}>Login</h1>
		  <Input 
			label="Client ID" 
			value={clientId}
			onChange={(e) => setClientId(e.target.value)}
			className="w-[150%]" />
		  <Input 
			label="Secret" 
			value={secret}
			onChange={(e) => setSecret(e.target.value)}
		  	className="w-[150%]" />
		  <Button onClick={handleLogin}>Login</Button>
		</div>
	  </div>
	);
  }