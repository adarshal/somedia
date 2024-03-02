import React from 'react'
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="homepage-content flex flex-wrap">
        <div className=" mt-2
            pt-2 image-container w-full md:w-1/2 flex-grow md:flex-grow-0">
          <Image
            src="/next.jpg" // Replace with your image path
            alt="Banner Image"
            width={1000}
      height={500}
            objectPosition="center" 
           
          />
        </div>
        <div className="text-container p-4 w-full md:w-1/2 flex-grow md:flex-grow">
          <h1 className="heading text-3xl font-bold mb-4">Social media Post handler and analytics</h1>
          <p className="description text-lg mb-6">
            Create and schedule your social media post from here. See detailed analytics on posts to  understand the performance of each post.
          </p>
          <button className="action-button bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow hover:bg-blue-700">
            explore
          </button>
        </div>
      </div>
    
  )
}

export default Hero
