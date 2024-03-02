import { redirect } from "next/navigation";
import useAuth from "./useAuth";
import React from "react";

interface ProtectedProps{
    children:React.ReactNode;
}
export default function Protected({children}:ProtectedProps) {
    const isAuthenticated=useAuth();
    isAuthenticated? children:redirect("/");
}