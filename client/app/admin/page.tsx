'use client'
import React from 'react'
import Heading from '../utils/Heading'
import AdminSidebar from '../components/Admin/Sidebar/AdminSidebar'

type Props={}

const page = () => {
  return (
    <div>
      <Heading 
      title="admin "
      description=" admin"
      keywords="Programming, MERN,REDUX" />
      <div className="flex h-[200vh]">
        <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
            </div>
            <div className="w-[85%]">


        </div>
      </div>
    </div>
  )
}

export default page
