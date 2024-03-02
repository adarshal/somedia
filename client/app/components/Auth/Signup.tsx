import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { styles } from "../../styles/Style";
import { useFormik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import { register } from "module";
import toast from "react-hot-toast";
type Props = {
  setRoute: (route: string) => void;
};
const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string().email("Invalid email").required("Please enter Email"),
  password: Yup.string().required("Please Enter your Password").min(6),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data,error,isSuccess}] = useRegisterMutation();

  useEffect(()=>{
    if(isSuccess){
        const message=data?.message || "Registartion Successfull";
        toast.success(message);
        setRoute("Verification")
    }
    if(error){
        if("data" in error){
            const errorData=error as any;
            toast.error(errorData.data.message)
        }
    }
  },[isSuccess,error,setRoute])


  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name,email, password }) => {
      const data={
        name,email,password
      }
      await register(data)
    },
  });

  const { errors, touched, values, handleChange, handleBlur, handleSubmit } =
    formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className={`${styles.label}`} htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name=""
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="add your name"
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            }
          `}
          />
          {errors.name && touched.name && (
            <span className="tetx-red-500 pt-2 block"> {errors.name}</span>
          )}
        </div>

        <label className={`${styles.label}`} htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="add your email id"
          className={`${errors.email && touched.email && "border-red-500"} ${
            styles.input
          }
          `}
        />
        {errors.email && touched.email && (
          <span className="tetx-red-500 pt-2 block"> {errors.email}</span>
        )}
        <div className="w-full mt-5 relativemb-1">
          <label className={`${styles.label}`} htmlFor="email">
            password
          </label>
          <input
            type={show ? "text" : "password"}
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="password"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}
          `}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className=" bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(!show)}
            />
          ) : (
            <AiOutlineEye
              className=" bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(!show)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="tetx-red-500 pt-2 block"> {errors.password}</span>
        )}
        <div className="w-full mt-5">
          <input type="submit" value="Signup" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="tetx-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join With
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer" ml-2 />
          <FaGithub size={30} className="ml-2 cursor-pointer" />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Already have Account??{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer "
            onClick={() => setRoute("Signup")}
          >
            Sign In
          </span>
        </h5>
      </form>
    </div>
  );
};

export default Signup;
