import React, { useEffect } from 'react'
import Image from 'next/image';
import { useGetAllPostsQuery } from '@/redux/features/posts/postsAPi';
import PostCard from '../PostCard';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const PublishedPost = () => {

  const {user}=useSelector((state:any)=>state.auth);
  // const {data} = useSession();
  
    const { data, isLoading,isSuccess, error,isError } = useGetAllPostsQuery(false);
    useEffect(()=>{
      
      if(data !== null && isSuccess ){
        toast.success("fetched published posts succesfully");
      }      
    },[data,user]);

    if(!user){
      return(
        <div>Signin to see  posts</div>
    )
    }
    if(isError){
      console.log(error, "err in usegetallpost")
        return(
            <div>no posts found</div>
        )
    }
    
    if (isLoading) {
        return <div>Loading posts...</div>;
      }
    const posts=data.posts;
    const scheduled=false;

  return (
    <div className="homepage-content flex flex-wrap mb-6">
        <div className="w-full">
          <h1 className="heading text-3xl font-bold mb-4">Your Total Published Posts are {posts.length} </h1>
          </div>
          <div className="flex flex-wrap post-cards mx-6 mt-8">
        {posts.map((post:any) => (
          <PostCard key={post._id} title={post.title} description={post.description} likes={post.likes} share={post.share} comments={post.comments} createdAt={post.createdAt.toString()} scheduled={scheduled} />
        ))}
      </div>
      <div className="w-full h-10">
        -
      </div>
          
        </div>    
    
  )
}
export default PublishedPost
