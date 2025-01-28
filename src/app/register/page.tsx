'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaEyeSlash, FaPen } from 'react-icons/fa6';
import { camera, logo } from '@/app/image';
import { Spinner } from '@nextui-org/react';
import { IoEye } from 'react-icons/io5';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { postImage } from '@/api/imagePost';
import { IoIosArrowBack } from 'react-icons/io';
import ButtonPrimary from '@/components/elements/buttonPrimary';
import InputFormError from '@/components/elements/input/InputFormError';


type Props = {}

const Register = (props: Props) => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true); // Untuk konfirmasi password
    const [errorMsg, setErrorMsg] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '', // Tambahkan untuk konfirmasi password
        image: '',
        role: '',

    });
    const [typePassword, setTypePassword] = useState("password");
    const [typeConfirmPassword, setTypeConfirmPassword] = useState("password"); // Untuk konfirmasi password
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '', // Tambahkan untuk konfirmasi password
        image: null as File | null,
        role: 'user',

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
        const newErrorMsg = { name: '', email: '', password: '', confirmPassword: '', image: '', role: '', number_phone: '', nik: '' };
        setErrorMsg(newErrorMsg);

        let valid = true;

        // Validasi nama
        const nameRegex = /^[A-Za-z\s\-\_\'\.\,\&\(\)]{1,100}$/;
        // Validasi email
        const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
        // Validasi password
        const passwordRegex = /^[A-Za-z0-9]+$/;

        // Cek apakah semua field diisi
        if (!form.name) {
            newErrorMsg.name = '*Nama harus diisi';
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


        if (!form.image) {
            newErrorMsg.image = '*Foto profil harus diunggah';
            valid = false;
        }


        if (form.name && !nameRegex.test(form.name)) {
            newErrorMsg.name = '*Masukkan nama yang valid';
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
        const imageUrl = await postImage({ image: form.image });
        if (imageUrl) {
            const { confirmPassword, ...dataWithoutConfirmPassword } = form;
            const data = { ...dataWithoutConfirmPassword, image: imageUrl };
            // registerUser(data, (status: boolean, res: any) => {
            //     if (res?.response?.data?.data?.error) {
            //         setErrorMsg({
            //             ...errorMsg, email: 'Email sudah terdaftar',
            //         })
            //     }
            //     if (status) {
            //         router.push('/login');
            //     }
            //     setLoading(false);
            // });
        }
    };


    const handleFileManager = (fileName: string) => {
        if (fileName === 'add') {
            const fileInput = document.getElementById("image-input-add") as HTMLInputElement | null;
            fileInput ? fileInput.click() : null;
        } else {
            console.log('error');
        }
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, InputSelect: string) => {
        if (InputSelect === 'add') {
            const selectedImage = e.target.files?.[0];

            if (selectedImage) {
                // Validasi tipe file
                const allowedTypes = ['image/png', 'image/jpeg'];
                if (!allowedTypes.includes(selectedImage.type)) {
                    setErrorMsg((prev) => ({
                        ...prev,
                        image: '*Hanya file PNG dan JPG yang diperbolehkan',
                    }));
                    return; // Tidak update state jika tipe file tidak valid
                }

                // Validasi ukuran file (dalam byte, 5MB = 5 * 1024 * 1024)
                const maxSize = 5 * 1024 * 1024;
                if (selectedImage.size > maxSize) {
                    setErrorMsg((prev) => ({
                        ...prev,
                        image: '*Ukuran file maksimal 5 MB',
                    }));
                    return; // Tidak update state jika ukuran file lebih dari 5MB
                }

                // Hapus pesan error jika file valid
                setErrorMsg((prev) => ({
                    ...prev,
                    image: '',
                }));

                // Update state dengan file yang valid
                setForm({ ...form, image: selectedImage });
            } else {
                console.log('error');
            }
        }
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
            <div className="container flex justify-center items-center w-[100vw] h-[99vh] ">
                <div className=" ">
                    {/* <div className="h-90 w-full hidden md:block">
                        <Image src={bgLogin} alt="human" />
                    </div> */}
                    <form className='p-6 bg-[#e9e9e9] rounded-lg  m-3 lg:m-0' onSubmit={handleRegister}>

                        <div className="images my-3">
                            {form.image && form.image instanceof Blob ? (
                                <div className='relative h-[90px] w-[90px] mx-auto '>
                                    <img className=" h-[90px] w-[90px]  rounded-full border-3 border-primary" src={URL.createObjectURL(form.image)} />
                                    <div className=" absolute bottom-0 right-0 ">
                                        <button className={` bg-primary rounded-full p-2 ${form.image === null ? 'hidden' : ''}`} type="button" onClick={() => handleFileManager('add')}>
                                            <FaPen color='#ffff' />
                                        </button>
                                    </div>
                                </div>

                            ) : (
                                <>
                                    <div className="images mx-auto border-dashed border-2 border-black rounded-full bg-gray-300 h-[80px] w-[80px] flex justify-center items-center relative">
                                        <button className="flex-col justify-center items-center h-full w-full" type="button" onClick={() => handleFileManager('add')}>
                                            <Image className="w-10 h-10 mx-auto" src={camera} alt="cam" />
                                        </button>
                                    </div>
                                    <p className='text-center mt-2 text-small text-red' >{errorMsg.image}</p>
                                </>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                id="image-input-add"
                                onChange={(e) => handleImageChange(e, 'add')}
                            />

                        </div>


                        <InputFormError errorMsg={errorMsg.name} placeholder='Masukkan Nama' type='text' htmlFor={'name'} value={form.name} onChange={handleChange} />

                        <div className="flex gap-3">
                            <InputFormError errorMsg={errorMsg.email} placeholder='Masukkan Email' type='email' htmlFor={'email'} value={form.email} onChange={handleChange} />
                            <div className="relative">
                                <button onClick={togglePassword} type='button' className={`icon-password h-full bg-transparent flex absolute right-0 justify-center items-center pe-4 pb-1 ${errorMsg.password ? 'pb-4' : ''}`}>
                                    {showPassword ? <FaEyeSlash size={20} color='#636363' /> : <IoEye size={20} color='#636363' />}
                                </button>
                                <InputFormError errorMsg={errorMsg.password} htmlFor="password" onChange={handleChange} type={typePassword} value={form.password} placeholder="Masukkan Kata Sandi" />
                            </div>
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
        </div>
    )
}

export default Register