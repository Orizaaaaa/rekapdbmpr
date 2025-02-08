'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaEyeSlash, FaPen } from 'react-icons/fa6';
import { camera, logo, oneLogo } from '@/app/image';
import { Spinner } from '@nextui-org/react';
import { IoEye } from 'react-icons/io5';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { postImage } from '@/api/imagePost';
import { IoIosArrowBack } from 'react-icons/io';
import ButtonPrimary from '@/components/elements/buttonPrimary';
import InputFormError from '@/components/elements/input/InputFormError';
import { register } from '@/api/auth';


type Props = {}

const Register = (props: Props) => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true); // Untuk konfirmasi password
    const [errorMsg, setErrorMsg] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '', // Tambahkan untuk konfirmasi password
        adress: '',
        role: '',

    });
    const [typePassword, setTypePassword] = useState("password");
    const [typeConfirmPassword, setTypeConfirmPassword] = useState("password"); // Untuk konfirmasi password
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '', // Tambahkan untuk konfirmasi password
        adress: '',
        role: 'admin',

    });

    const togglePassword = () => {
        setShowPassword(!showPassword);
        setTypePassword(showPassword ? "text" : "password");
    };

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
        setTypeConfirmPassword(showConfirmPassword ? "text" : "password");
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Update state untuk input lainnya
        setForm({ ...form, [name]: value });
    };


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Reset error messages
        const newErrorMsg = { username: '', email: '', password: '', confirmPassword: '', role: '', number_phone: '', nik: '', adress: '' };
        setErrorMsg(newErrorMsg);

        let valid = true;

        // Validasi nama
        const nameRegex = /^[A-Za-z\s\-\_\'\.\,\&\(\)]{1,100}$/;
        // Validasi email
        const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
        // Validasi password
        const passwordRegex = /^[A-Za-z0-9]+$/;

        // Cek apakah semua field diisi
        if (!form.username) {
            newErrorMsg.username = '*Nama harus diisi';
            valid = false;
        }
        if (!form.email) {
            newErrorMsg.email = '*Email harus diisi';
            valid = false;
        }
        if (!form.password) {
            newErrorMsg.password = '*Password harus diisi';
            valid = false;
        }

        if (form.password !== form.confirmPassword) {
            newErrorMsg.confirmPassword = '*Password dan Konfirmasi Password tidak sama';
            valid = false;
        }




        if (form.username && !nameRegex.test(form.username)) {
            newErrorMsg.username = '*Masukkan nama yang valid';
            valid = false;
        }

        if (form.email && !emailRegex.test(form.email)) {
            newErrorMsg.email = '*Masukkan email yang valid';
            valid = false;
        }

        if (form.password && (!passwordRegex.test(form.password) || form.password.length < 8)) {
            newErrorMsg.password = '*Password harus 8 karakter atau lebih';
            valid = false;
        }

        setErrorMsg(newErrorMsg);

        if (!valid) {
            setLoading(false);
            return;
        }
        // Jika lolos validasi

        const { confirmPassword, ...dataWithoutConfirmPassword } = form;
        const data = { ...dataWithoutConfirmPassword };
        register(data, (status: boolean, res: any) => {
            if (res?.response?.data?.data?.error) {
                setErrorMsg({
                    ...errorMsg, email: 'Email sudah terdaftar',
                })
            }

            if (status) {
                router.push('/');
            }

            console.log(res);
            setLoading(false);
        });



    };






    console.log(form);

    return (
        <div className="register">

            <div className="container mx-auto">
                <div className="flex items-center py-3 cursor-pointer " onClick={() => router.back()}>
                    <IoIosArrowBack size={20} color='white' />
                    <p className='text-white' >Kembali</p>
                </div>

            </div>
            <div className="container mx-auto flex justify-center items-center w-[100vw] h-[99vh] ">

                {/* <div className="h-90 w-full hidden md:block">
                        <Image src={bgLogin} alt="human" />
                    </div> */}
                <form className='p-6 bg-[#e9e9e9] rounded-lg  m-3 lg:m-0' onSubmit={handleRegister}>


                    <div className="logo flex justify-center my-5">
                        <Image src={oneLogo} alt="logo" width={130} height={150} />
                    </div>


                    <InputFormError errorMsg={errorMsg.username} placeholder='Masukkan Nama' type='text' htmlFor={'username'} value={form.username} onChange={handleChange} />

                    <div className="flex gap-3">
                        <InputFormError errorMsg={errorMsg.email} placeholder='Masukkan Email' type='email' htmlFor={'email'} value={form.email} onChange={handleChange} />
                        <InputFormError errorMsg={errorMsg.adress} placeholder='Masukkan Alamat' type='text' htmlFor={'adress'} value={form.adress} onChange={handleChange} />
                    </div>

                    <div className="relative">
                        <button onClick={togglePassword} type='button' className={`icon-password h-full bg-transparent flex absolute right-0 justify-center items-center pe-4 ${errorMsg.password ? 'pb-4' : ''}`}>
                            {showPassword ? <FaEyeSlash size={20} color='#636363' /> : <IoEye size={20} color='#636363' />}
                        </button>
                        <InputFormError errorMsg={errorMsg.password} htmlFor="password" onChange={handleChange} type={typePassword} value={form.password} placeholder="Masukkan Kata Sandi" />
                    </div>
                    {/* Tambahan form untuk Konfirmasi Password */}
                    <div className="relative mt-1">
                        <button onClick={toggleConfirmPassword} type='button' className={`icon-password h-full bg-transparent flex absolute right-0 justify-center items-center pe-4 ${errorMsg.confirmPassword ? 'pb-4' : ''}`}>
                            {showConfirmPassword ? <FaEyeSlash size={20} color='#636363' /> : <IoEye size={20} color='#636363' />}
                        </button>
                        <InputFormError errorMsg={errorMsg.confirmPassword} htmlFor="confirmPassword" onChange={handleChange} type={typeConfirmPassword} value={form.confirmPassword} placeholder="Konfirmasi Kata Sandi" />
                    </div>
                    <ButtonPrimary typeButon={"submit"} className={`rounded-lg w-full mb-3 font-medium py-2 flex justify-center items-center  bg-primary`}>
                        {loading ? <Spinner className={`w-5 h-5`} size="sm" color="white" /> : 'Daftar'}
                    </ButtonPrimary>
                    <p className='text-sm'>Sudah punya akun ? <Link className='text-primary font-medium ' href={'/'} > Masuk</Link></p>
                </form>
            </div>


        </div>
    )
}

export default Register