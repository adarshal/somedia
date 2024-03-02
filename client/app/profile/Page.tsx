'use client'
import React, { FC, useState } from 'react'
import Protected from '../hooks/useProtected'
import Heading from '../utils/Heading'
import Header from '../components/Header'
import { useSelector } from 'react-redux'
type Props={

}

const Page:FC<Props> = (props) => {
    const [open,setOpen]=useState(false);
  const [activeItem,setActiveItem]=useState(0);
  const [route,setRoute]=useState("Login");
  const {user}=useSelector((state:any)=>state.auth)
  return (
    <div>
      <Protected>
      <Heading 
      title={`${user?.name} profile`}
      description="Building somedia sys "
      keywords="Programming react MERN "
      />
      <Header open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      setRoute={setRoute}
      route={route}
      />
      </Protected>
    </div>
  )
}

export default Page
