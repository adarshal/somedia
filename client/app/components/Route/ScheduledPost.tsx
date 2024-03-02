import React, { useEffect } from 'react'
import Image from 'next/image';
import {  useGetFuturePostsQuery } from '@/redux/features/posts/postsAPi';
import PostCard from '../PostCard';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const ScheduledPost = () => {

  const {user}=useSelector((state:any)=>state.auth);
  // const {data} = useSession();
  
    const { data, isLoading,isSuccess, error,isError } = useGetFuturePostsQuery(false);
    useEffect(()=>{
      
      if(data !== null && isSuccess ){
        toast.success("fetched scheduled posts succesfully");
      }      
    },[data,user]);

    if(!user){
      return(
        <div>Signin to see  posts</div>
    )
    }
    if(isError){
      console.log(error, "err in getting scheduled posts")
        return(
            <div>no scheduled posts found</div>
        )
    }
    
    
    if (isLoading) {
        return <div>Loading scheduled posts...</div>;
      }
    const posts=data.posts;
    const scheduled=true;
  return (
    <div >
        <div>
          <div className="w-full">
          <h1 className="w-full heading text-3xl font-bold mb-4">Your Total Published Posts are {posts.length} </h1>
          <br />
          </div>
          </div>
          <div className="homepage-content flex flex-wrap mt-1">
          <div className="post-cards">
        {posts.map((post:any) => (
          <PostCard key={post._id} title={post.title} description={post.description} likes={post.likes} share={post.share} comments={post.comments} createdAt={post.scheduledAt.toString()} scheduled={scheduled} />
        ))}
      </div>
      </div>
        </div>    
    
  )
}
export default ScheduledPost;
