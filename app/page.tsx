"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);
  
  useEffect(() => {
    user && checkUser();
  },[user]);

  const checkUser = async () => {
    const result = await createUser({
      userName: user?.fullName as string,
      email: user?.primaryEmailAddress?.emailAddress as string,
      imageUrl: user?.imageUrl as string
    });
    console.log(result);
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <Image src={"/studylmlogo.png"} alt="" width={400} height={400}/>
      <div className="flex-col p-3">
      <p className="text-xl mb-3">Your AI Study Partner</p>
      <Button> <Link href="/sign-in">Log In</Link> </Button> OR <Button><Link href="/sign-up">Sign Up</Link></Button>
      </div>
    </div>
  );
}
