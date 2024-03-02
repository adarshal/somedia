'use client'
import React, { FC, useState }   from "react"
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Protected from "./hooks/useProtected";
import PublishedPost from "./components/Route/PublishedPost";
import PostForm from "./components/Route/PostForm";
import ScheduledPost from "./components/Route/ScheduledPost";

interface Props{}

const Page: FC<Props>=(props)=>{
  const [open,setOpen]=useState(false);
  const [activeItem,setActiveItem]=useState(0);
  const [route,setRoute]=useState("Login");
  return(
    <div>
      <Heading 
      title="LMS platform"
      description="Building lms sys "
      keywords="Programming react MERN 21"
      />
      <Header open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      setRoute={setRoute}
      route={route}
      />
      <Hero />
      <PostForm />
      <PublishedPost />
      <ScheduledPost />
    </div>
  )
}
export default Page;