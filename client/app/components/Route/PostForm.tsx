import React, { useEffect, useState } from "react";
import { styles } from '../../styles/Style';

import { Formik, Form, Field, ErrorMessage, useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import {
  usePostNowMutation,
  useSchedulePostMutation,
} from "@/redux/features/posts/postsAPi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const PostForm = () => {
  const [isScheduled, setIsScheduled] = useState(false); // State to track scheduled post selection
  const {user}=useSelector((state:any)=>state.auth);
  

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("description is required"),
    scheduledAt: isScheduled
      ? Yup.date().required("Scheduled time is required for scheduled posts")
      : Yup.date().optional(),
  });
  const [postNow, { isError,data,  }] = usePostNowMutation();
  const [schedulePost, {error, isSuccess }] = useSchedulePostMutation();
  const [submitting,setSubmitting]=useState(false);

  const formik=useFormik({
    initialValues:{title:"", description:"",scheduledAt:null},
    validationSchema:validationSchema,
    onSubmit:async({title,description,scheduledAt})=>{
        console.log("inside handle submit of posts")
        if (!isScheduled) {
          await postNow({ title, description });
        } else {
          const formattedScheduledAt = scheduledAt
          ? new Date(scheduledAt).toISOString()
          : null;
          setSubmitting(true);
        await schedulePost({
          title,
          description,
          createdAt: formattedScheduledAt,
        });
        setSubmitting(false);
      }
    }
});
useEffect(()=>{
  if(isSuccess || !isError){
    toast.success(`posted Successfully ${data}`);
  }
  if(error || isError){
    if(error){
      if("data" in error){
        const errorData=error as any;
        toast.error(errorData.data.message)
    }
  }else{
    toast.error("error in posting")
  }
  }
}
,[isSuccess,isError])
// const {errors,touched,values,handleChange,handleBlur,handleSubmit}=formik;


  if(!user){
    return(
      <div>Signin to create  posts</div>
  )
  }
    const handleSubmit = async (values:any, { setSubmitting, resetForm }:{setSubmitting:any, resetForm:any}) => {
      try {
        setSubmitting(true); // Set submitting state to true
        const { title, description,scheduledAt } = values;
  
        if (!isScheduled) {
          // Submit post immediately using postNow
          await postNow({ title, description });
        } else {
          // Schedule post using schedulePost
          const formattedScheduledAt = new Date().toISOString(); // Assuming immediate scheduling
          console.log(scheduledAt,formattedScheduledAt)
          await schedulePost({ title, description, scheduledAt });
        }
  
        resetForm(); // Reset form after successful submission
      } catch (error) {
        console.error(error); // Handle errors
      } finally {
        setSubmitting(false); // Set submitting state to false regardless of success or failure
      }
    };
  
    return (
      <Formik initialValues={{ title: '', description: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, errors, touched }) => (
          <Form className={`${styles.formStyle}`}>
            <h2 className={`${styles.title}`}>Create Post</h2>
            <Field type="text" name="title" placeholder="Title" className={`${styles.input}`} />
            <ErrorMessage name="title" component="div" className="error" />
  
            <Field as="textarea" name="description" placeholder="Description"  className={`${styles.input}`}/>
            <ErrorMessage name="description" component="div" className="error" />
  
            <div className="scheduled-container">
              <label htmlFor="schedule">
                <input
                  type="checkbox"
                  id="schedule"
                  checked={isScheduled}
                  onChange={() => setIsScheduled(!isScheduled)}
                  
                />
                Schedule Post
              </label>
            </div>
            {isScheduled && (
              <div>
                <Field
                  type="datetime-local"
                  name="scheduledAt"
                  placeholder="Schedule Time"
                />
                <ErrorMessage
                  name="scheduledAt"
                  component="div"
                  className="error"
                />
              </div>
            )}
  
           <button type="submit" disabled={submitting} className={`${styles.button}`}>
              {isSubmitting ? 'Submitting...' : isScheduled ? 'Schedule Post' : 'Publish Now'}
            </button>

          </Form>
        )}
      </Formik>
    );
  };
   
  

export default PostForm;
