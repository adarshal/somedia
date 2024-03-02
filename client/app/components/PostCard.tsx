import React, { FC } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { MdChatBubbleOutline, MdFavoriteBorder } from 'react-icons/md';
import { PiShareNetworkDuotone } from 'react-icons/pi';
import { boolean } from 'yup';

type Props= {
    title: string;
    description?: string; // Optional property
    likes: number;
    share: number;
    comments: number;
    createdAt: string;
    scheduled: boolean;
  }
const PostCard:FC<Props> = ({title,description,likes,share,comments,createdAt, scheduled}) => {
  return (
    <Card sx={{ maxWidth: 345 }} className="m-4 ">
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         Likes <MdFavoriteBorder /> {likes}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          shares - <PiShareNetworkDuotone /> {share}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total comments <MdChatBubbleOutline /> {comments}
        </Typography>
        {scheduled && (<Typography variant="body2" color="text.secondary">
        scheduled At {createdAt}
        </Typography>)}
        {!scheduled && (<Typography variant="body2" color="text.secondary">
        created At At {createdAt}
        </Typography>)}
      </CardContent>
      
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
     
    </Card>
  )
}

export default PostCard
