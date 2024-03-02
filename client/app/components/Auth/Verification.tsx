import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { styles } from '../../styles/Style';
import React, { FC, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useActivationMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';

type Props={
    setRoute:(rote:string)=> void ;
}
type verifyNumber={
    "0":string;
    "1":string;
    "2":string;
    "3":string;
}

const Verification:FC<Props> = ({setRoute}) => {
    const {token}= useSelector((state:any)=>state.auth)
    const [activation, {isSuccess,error}]=useActivationMutation();

    useEffect(()=>{
        if(isSuccess){
            toast.success("Account created successfully");
            setRoute("Login");
        };
        if(error){
            if("data" in error){
                const errorData=error as any;
                toast.error(errorData.data?.message || "Server Error")
                setInvalidError(true)
            }else{
                console.log("An error occured",error)
            }
        }
    },[isSuccess,error])

    const [invalidError,setInvalidError]=useState(false)
    const inputRefs=[
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];
    const [verifyNumber,setVerifyNumber]=useState<verifyNumber>({
        0:"",
        1:"",
        2:"",
        3:"",
    })

    const verificationHandller=async()=>{
        const verificationNumber=Object.values(verifyNumber).join("");
        if(verificationNumber.length!==4){
            setInvalidError(true);
        }else{
            await activation({
                activation_token:token,
                activation_code:verificationNumber
            })
        }
       
    }
    const handleInputChange=(index:number,value:string)=>{
        setInvalidError(false)
        const newVerifyNumber={...verifyNumber,[index]:value};
        setVerifyNumber(newVerifyNumber)
        if(value==="" && index>0){
            inputRefs[index-1].current?.focus();
        }else if(value.length===1 && index<3){
            inputRefs[index+1].current?.focus();
        }
    }
  return (
    <div>
      <h1 className={`${styles.title}`} >
        verify your Account
      </h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center"
        >
            <VscWorkspaceTrusted size={40} />

        </div>       

      </div>
      <br />
        <br />
        <div className=" m-auto flex items-center justify-around ">
            {Object.keys(verifyNumber).map((key,index)=>(
            <input type="number" 
             key={key} ref={inputRefs[index]}
             className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center ${
                invalidError? "shake border-red-500"
                :" dark:border-white border-black"
             }`}
             placeholder=''
             maxLength={1}
             value={verifyNumber[key as keyof verifyNumber]}
             onChange={e=>handleInputChange(index,e.target.value)}
             />
            ))}
    </div>
    <br />
    <br />
    <div className="w-full flex justify-center">
    <button
    className={`${styles.button}`}
    onClick={verificationHandller}
    > verify OTP</button>
    </div>
    <br />
    <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Go back to Login?
        <span 
        className="text-[#2190ff] pl-1 cursor-pointer"
        onClick={()=>setRoute("Login")}>
Login
        </span>
    </h5>
    </div>
  )
}

export default Verification
