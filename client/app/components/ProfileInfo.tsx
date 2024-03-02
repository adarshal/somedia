import React, { FC } from 'react'
// 3.42.29

type Props={
    avatar:string | null;
    user:any;
}
const ProfileInfo:FC<Props> = ({user,avatar}) => {
  return (
    <div>
      ProfileInfo
    </div>
  )
}

export default ProfileInfo
