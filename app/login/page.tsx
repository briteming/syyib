// mark as client component
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  // extracting data from useSession as session
  const { data: session, status } = useSession();

  // function to fetch GitHub access token
  const fetchAccessToken = () => {
    if (status === "authenticated") {
      const { accessToken } = session as any;
      console.log("aaa:", session?.access_token);
      console.log("GitHub Access Token:", accessToken);
    }
  };
  const getGithubIssue = () => {
    const accessToken = session?.access_token;
    
    if (!accessToken) {
      console.error('No access token available.');
      return;
    }

    fetchGithubData(accessToken); 
  };
  const fetchGithubData = async (accessToken: any) => {
    try {
      const response = await fetch('https://api.github.com/repos/Shih-Yang-Chen/try-next/issues', {
        method: 'GET', 
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json' // use GitHub REST API v3
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub issues');
      }

      const data = await response.json();
      console.log(data); 
    } catch (error) {
      console.error('Error fetching GitHub issues:', error);
    }
  };

  const handleClick = () => {
    getGithubIssue();
  };
  // useEffect to fetch access token on session status change
  useEffect(() => {
    fetchAccessToken(); // initial fetch on component load

    // fetch access token on session status change
    if (status === "authenticated") {
      fetchAccessToken();
    }
  }, [session, status]);

  // checking if session exists
  if (session) {
    // rendering components for logged-in users
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <p className="text-2xl mb-2">
          Welcome <span className="font-bold">{session.user?.name}</span>. Signed In As
        </p>
        <button
        id="getUserData"
        className="bg-none border-gray-300 border py-2 px-6 rounded-md mb-2"
        onClick={handleClick}
      >
        Get GitHub Data
      </button>
        <p className="font-bold mb-4">{session.user?.email}</p>
        <button className="bg-red-600 py-2 px-6 rounded-md" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  // rendering components for not logged-in users
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <p className="text-2xl mb-2">Not Signed In</p>
      <button
        className="bg-none border-gray-300 border py-2 px-6 rounded-md mb-2"
        onClick={() => signIn("github")}
      >
        Sign in with GitHub
      </button>
    </div>
  );
}