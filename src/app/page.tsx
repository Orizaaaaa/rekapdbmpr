'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import InputForm from '@/components/elements/input/InputForm';
import ButtonPrimary from '@/components/elements/buttonPrimary';
import { FaEyeSlash } from 'react-icons/fa6';
import { IoEye } from 'react-icons/io5';
import { loginService, url } from '@/api/auth';
import { Spinner } from '@nextui-org/react';
import { oneLogo } from './image';

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(true)
  const [errorLogin, setErrorLogin] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [typePassword, setTypePassword] = useState("password")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })


  const togglePassword = () => {
    setShowPassword(!showPassword);
    if (typePassword === "password") {
      setTypePassword("text");
    } else {
      setTypePassword("password");
    }
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, } = e.target;
    setForm({ ...form, [name]: value });

    const updatedValues = {
      ...form,
      [name]: value,
    };

    if (updatedValues.email !== "" && updatedValues.password !== "" && (updatedValues.email.includes('@gmail.com') || updatedValues.email.includes('@test.com'))) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }

  }

  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
    await loginService(form, (status: boolean, res: any) => {
      if (status) {
        const tokenCookies = document.cookie = `token=${res.data.token}`
        if (tokenCookies) {

          console.log(res.data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('name', res?.data?.username);
            localStorage.setItem('role', res?.data?.role);
            localStorage.setItem('token', res?.data?.token);
          }
          router.push('/dashboard');
          setLoading(false)
        }
      } else {
        setErrorLogin('*Email atau password salah')
        console.log(res.data);
        setLoading(false)
      }
    })
  };



  return (
    <div className="login">
      <div className="container mx-auto flex justify-center items-center w-[100vw] h-[100vh] ">
        <form className='p-6 bg-[#e9e9e9] rounded-lg w-96 m-3 lg:m-0' onSubmit={handleLogin}>
          <div className="logo flex justify-center my-5">
            <Image src={oneLogo} alt="logo" width={100} height={130} />
          </div>

          <InputForm placeholder='Masukkan Email' type='email' htmlFor={'email'} value={form.email} onChange={handleChange} />
          <div className="relative">
            <button onClick={togglePassword} type='button' className='icon-password h-full  bg-transparent flex absolute right-0 justify-center items-center pe-4' > {showPassword ? <FaEyeSlash size={20} color='#636363' /> : <IoEye size={20} color='#636363' />} </button>
            <InputForm className='form-input-login' htmlFor="password" onChange={handleChange} type={typePassword} value={form.password} placeholder="Masukkan Kata Sandi" />
          </div>
          <p className='text-red my-3 text-sm' >{errorLogin}</p>
          <ButtonPrimary typeButon={"submit"} disabled={disabled} className={`rounded-lg w-full mb-3 font-medium py-2 `}>
            {loading ? <Spinner className={`w-5 h-5 `} size="sm" color="white" /> : 'Login'}
          </ButtonPrimary>
        </form>
      </div>
    </div>
  )
}

export default Login