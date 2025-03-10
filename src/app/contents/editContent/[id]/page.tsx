'use client'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import Card from '@/components/elements/card/Card'
import CaraoselImage from '@/components/fragemnts/caraoselProduct/caraoselProduct'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { SwiperSlide } from 'swiper/react'

import ButtonPrimary from '@/components/elements/buttonPrimary'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { IoCloseCircleOutline } from 'react-icons/io5'
import InputForm from '@/components/elements/input/InputForm'
import { Autocomplete, AutocompleteItem, DatePicker } from '@nextui-org/react'
import { formatDate, formatDateStr } from '@/utils/helper'
import { parseDate } from '@internationalized/date'
import { IoIosClose } from 'react-icons/io'
import { postMediaArray } from '@/api/imagePost'
import { getDetailContent, socialPlatforms, updateContent } from '@/api/content'
import { camera } from '@/app/image'
import toast, { Toaster } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation'

type Props = {}

interface SocialAccount {
    platform: string;
    account_id: string;
    post_url: string;
}

interface Content {
    title: string,
    content: string,
    media: File[],
    hashtags: string[];
    mentions: string[];
    scheduled_at: string,
    social_accounts: SocialAccount[]
}


const Page = (props: Props) => {
    const router = useRouter()
    const { id }: any = useParams()
    const dateNow = new Date();
    const [selectedDate, setSelectedDate] = useState(parseDate((formatDate(dateNow))))
    const [form, setForm] = React.useState<Content>({
        title: '',
        content: '',
        media: [] as File[],
        hashtags: [''], // Default ada satu input kosong
        mentions: [''], // Default ada satu input kosong
        scheduled_at: '',
        social_accounts: [{ platform: '', account_id: '66666', post_url: '' }],
    });

    useEffect(() => {
        getDetailContent(id, (response: any) => {
            const result = response.data
            if (result) {
                setForm(result)
                console.log(result);

                setSelectedDate(parseDate(formatDate(result.scheduled_at)))
            }
        })
    }, []);

    const [loading, setLoading] = useState(false)

    const [errorMsg, setErrorMsg] = React.useState({
        image: '',
        imageUpdate: ''
    })
    React.useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            scheduled_at: formatDateStr(selectedDate),
        }));
    }, [selectedDate]);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>, InputSelect: string) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        const allowedImageTypes = ['image/png', 'image/jpeg'];
        const allowedVideoTypes = ['video/mp4'];
        const maxImageSize = 5 * 1024 * 1024; // 5MB
        const maxVideoSize = 300 * 1024 * 1024; // 300MB

        const isImage = allowedImageTypes.includes(selectedFile.type);
        const isVideo = allowedVideoTypes.includes(selectedFile.type);

        if (InputSelect === 'add') {
            // Validasi tipe file
            if (!isImage && !isVideo) {
                setErrorMsg((prev) => ({
                    ...prev,
                    media: '*Hanya file PNG, JPG, atau MP4 yang diperbolehkan',
                }));
                return;
            }

            // Validasi ukuran file
            if ((isImage && selectedFile.size > maxImageSize) || (isVideo && selectedFile.size > maxVideoSize)) {
                setErrorMsg((prev) => ({
                    ...prev,
                    media: `*Ukuran file maksimal ${isImage ? '5MB' : '300MB'}`,
                }));
                return;
            }

            // Hapus pesan error jika file valid
            setErrorMsg((prev) => ({
                ...prev,
                media: '',
            }));

            // Update state form dengan file yang valid
            setForm((prevState) => ({
                ...prevState,
                media: [...prevState.media, selectedFile],
            }));
        } else {
            // Validasi untuk update
            if (!isImage && !isVideo) {
                setErrorMsg((prev) => ({
                    ...prev,
                    mediaUpdate: '*Hanya file PNG, JPG, atau MP4 yang diperbolehkan',
                }));
                return;
            }

            if ((isImage && selectedFile.size > maxImageSize) || (isVideo && selectedFile.size > maxVideoSize)) {
                setErrorMsg((prev) => ({
                    ...prev,
                    mediaUpdate: `*Ukuran file maksimal ${isImage ? '5MB' : '300MB'}`,
                }));
                return;
            }

            setErrorMsg((prev) => ({
                ...prev,
                mediaUpdate: '',
            }));
        }
    };


    const deleteArrayMedia = (index: number, type: string) => {
        if (type === 'add') {
            setForm((prevState) => ({
                ...prevState,
                media: prevState.media.filter((_, i) => i !== index),
            }));
        }
    };


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }


    const handleChangeMultiple = (field: 'hashtags' | 'mentions', index: number, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) => (i === index ? value : item)),
        }));
    };

    // Tambahkan input baru ke dalam array hashtags atau mentions
    const handleAddField = (field: 'hashtags' | 'mentions') => {
        setForm((prev) => ({
            ...prev,
            [field]: [...prev[field], ''], // Tambahkan string kosong untuk input baru
        }));
    };

    const handleDeleteField = (field: 'hashtags' | 'mentions', index: number) => {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index), // Hapus elemen berdasarkan index
        }));
    };


    const handleDateChange = (date: any | null) => {
        setSelectedDate(date);
        setForm((prevForm) => ({
            ...prevForm,
            scheduled_at: formatDateStr(date),
        }));
    };



    // Fungsi untuk menambahkan akun sosial media baru
    const handleAddSocialAccount = () => {
        setForm((prev: any) => ({
            ...prev,
            social_accounts: [...prev.social_accounts, { platform: '', account_id: '6666666', post_url: '' }],
        }));
    };

    const handleChangeSocial = (index: number, key: keyof SocialAccount, value: string) => {
        setForm((prev) => ({
            ...prev,
            social_accounts: prev.social_accounts.map((account, i) =>
                i === index ? { ...account, [key]: value } : account
            ),
        }));
    };

    // Fungsi untuk menghapus akun sosial media
    const handleDeleteSocialAccount = (index: any) => {
        setForm((prev: any) => ({
            ...prev,
            social_accounts: prev.social_accounts.filter((_: any, i: any) => i !== index),
        }));
    };

    const handleDropdownSelection = (selectedValue: string, index: number) => {
        const updatedSocialAccounts = form.social_accounts.map((account, i) =>
            i === index ? { ...account, platform: selectedValue } : account
        );
        setForm({ ...form, social_accounts: updatedSocialAccounts });
    };


    // handle update belum
    const handleUpdateContent = async () => {
        // Validasi semua field yang diperlukan
        if (
            !form.title || // Judul tidak boleh kosong
            !form.content || // Konten tidak boleh kosong
            form.media.length === 0 || // Media tidak boleh kosong
            !form.scheduled_at || // Tanggal tidak boleh kosong
            form.hashtags.length === 0 || // Pastikan ada setidaknya satu hashtag
            form.mentions.length === 0 || // Pastikan ada setidaknya satu mention
            form.social_accounts.length === 0 || // Pastikan ada setidaknya satu akun sosial
            form.social_accounts.some(account => !account.platform || !account.post_url) // Platform dan post_url tidak boleh kosong
        ) {
            toast.error("Harap isi semua form", { duration: 4000 });
            return;
        }

        // Lanjutkan proses update jika semua field valid
        setLoading(true);

        // Tampilkan toast loading sebelum update dimulai
        const toastId = toast.loading("Memperbarui konten...");

        // Pisahkan URL lama dan file baru
        const existingUrls = form.media.filter((item: any): item is string => typeof item === 'string');
        const newFiles = form.media.filter((item: any): item is File => item instanceof File);

        // Upload gambar baru ke Cloudinary jika ada
        let uploadedUrls: string[] = [];
        if (newFiles.length > 0) {
            uploadedUrls = (await postMediaArray({ media: newFiles })).filter(Boolean); // Filter null values
        }

        // Gabungkan URL lama dan baru
        const allUrls = [...existingUrls, ...uploadedUrls];

        // Data untuk dikirim ke API
        const data = {
            ...form,
            media: allUrls,
        };

        // Panggil fungsi updateContent
        await updateContent(id, data, (result: any) => {
            console.log("Update berhasil:", result);
            setLoading(false);
            toast.dismiss(toastId); // Hapus toast loading
            toast.success("Konten sukses di edit", { duration: 1000 });

            // Tunda navigasi agar toast bisa terlihat selama 4 detik
            setTimeout(() => {
                router.push(`/contents/${id}`);
            }, 1000);
        });
    };







    console.log(errorMsg);
    console.log(form);
    console.log(errorMsg);


    return (
        <DefaultLayout>
            <Card padding='p-3' >

                {/* <div className="flex gap-3">
                    <button onClick={() => buttonChangedTypeContent('instagram')}
                        className={`${form.typeContent === 'instagram' ? 'bg-black text-white' : 'border-black  text-black bg-white'} py-1 px-4 rounded-lg border-2
                         `}>
                        Instagram
                    </button>

                    <button onClick={() => buttonChangedTypeContent('tiktok')}
                        className={`${form.typeContent === 'tiktok' ? 'bg-black text-white' : 'border-black  text-black bg-white'} py-1 px-4 rounded-lg border-2
                        `}>
                        Tiktok
                    </button>
                </div> */}

                <div className="content mt-4 mb-2">
                    <CaraoselImage>
                        {form?.media?.length > 0 ? (
                            form?.media?.map((media, index) => (
                                <SwiperSlide key={index}>
                                    <>
                                        <div className="flex justify-center items-center" >
                                            {media?.type?.startsWith('image/') ? (
                                                // Tampilkan gambar
                                                <img
                                                    src={typeof media === 'string' ? media : URL.createObjectURL(media)}
                                                    alt={`preview-${index}`}
                                                    className="w-auto h-[200px] relative"
                                                />
                                            ) : media?.type?.startsWith('video/') ? (
                                                // Tampilkan video
                                                <video
                                                    controls
                                                    src={URL.createObjectURL(media)}
                                                    className="w-auto h-[200px] relative z-999999"
                                                />
                                            ) :
                                                <img
                                                    src={typeof media === 'string' ? media : URL.createObjectURL(media)} // Cek apakah image berupa string atau File
                                                    alt={`preview-${index}`}
                                                    className="w-auto h-[200px] relative"
                                                />
                                            }
                                        </div>
                                        <button
                                            onClick={() => deleteArrayMedia(index, 'add')}
                                            className="button-delete array image absolute top-0 right-0 z-10"
                                        >
                                            <IoCloseCircleOutline color="red" size={34} />
                                        </button>
                                    </>
                                </SwiperSlide>
                            ))
                        ) : (
                            <div className="flex justify-center border-2 border-dashed">
                                <Image className="w-auto h-[200px] relative" src={camera} alt="image" />
                            </div>
                        )}
                    </CaraoselImage>

                    <div className="grid grid-cols-2 justify-between mt-5 gap-2">
                        <ButtonPrimary className='rounded-md relative cursor-pointer py-2 px-1' >Tambah Konten
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="image-input-add"
                                onChange={(e) => handleMediaChange(e, 'add')}
                            />
                        </ButtonPrimary>
                        <ButtonSecondary className='rounded-md  py-2 px-1' onClick={() => setForm(prevForm => ({ ...prevForm, media: [] }))} >Hapus Semua Media</ButtonSecondary>
                    </div>

                </div>
                <InputForm title='Judul' className='border-2 ' onChange={handleChange} value={form.title} htmlFor='title' type='text' />
                <div className="hashtag">
                    <h1>Hashtags</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-2">
                        {form.hashtags.map((hashtag: any, index) => (
                            <React.Fragment key={index}>
                                <div className="input relative">
                                    {form.hashtags.length > 1 && (
                                        <IoIosClose
                                            className="delete-array absolute cursor-pointer end-0 bottom-12"
                                            color="red"
                                            size={30}
                                            onClick={() => handleDeleteField('hashtags', index)}
                                        />
                                    )}
                                    <InputForm className='border-2 '
                                        value={hashtag}
                                        onChange={(e: any) => handleChangeMultiple('hashtags', index, e.target.value)}
                                        placeholder='' htmlFor='hashtags' type='text' />
                                </div>
                            </React.Fragment>
                        ))}
                        <AiOutlinePlusCircle
                            className="button-add-more my-2 cursor-pointer"
                            size={30}
                            onClick={() => handleAddField('hashtags')}
                        />
                    </div>
                </div>

                <div className="mentions">
                    <h1>Mentions</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-2">
                        {form.mentions.map((mentions, index) => (
                            <React.Fragment key={index}>
                                <div className="input relative">
                                    {form.mentions.length > 1 && (
                                        <IoIosClose
                                            className="delete-array absolute cursor-pointer end-0 bottom-12"
                                            color="red"
                                            size={30}
                                            onClick={() => handleDeleteField('mentions', index)}
                                        />
                                    )}
                                    <InputForm className='border-2 '
                                        value={mentions}
                                        onChange={(e: any) => handleChangeMultiple('mentions', index, e.target.value)}
                                        placeholder='' htmlFor='mentions' type='text' />
                                </div>

                            </React.Fragment>
                        ))}
                        <AiOutlinePlusCircle
                            className="button-add-more my-2 cursor-pointer"
                            size={30}
                            onClick={() => handleAddField('mentions')}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1>Tanggal</h1>
                    <DatePicker
                        size='sm'
                        onChange={handleDateChange}
                        value={selectedDate}
                        aria-label='datepicker' className=" lg:w-75 mb-2 bg-white border-2
                         border-primary rounded-lg" />
                </div>
                <div className="social-media mt-5">
                    {form.social_accounts.map((account, index) => (
                        <div key={index} className="flex items-center gap-3 mb-3 relative">

                            <div className="media mb-3">
                                <h1 className='mb-1'>
                                    Sosial Media
                                </h1>
                                <Autocomplete
                                    aria-label='none'
                                    isRequired
                                    className="max-w-xs rounded-lg border-2 "
                                    defaultItems={socialPlatforms}
                                    selectedKey={account.platform} // Menggunakan selectedKey agar selalu sesuai state
                                    inputValue={account.platform}
                                    size='sm'
                                    onSelectionChange={(selected) => handleDropdownSelection(String(selected), index)}
                                >
                                    {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                                </Autocomplete>
                            </div>

                            <div className="link">
                                <InputForm htmlFor='post_url' title='Link' className='border-2 h-4 m-0 p-0' onChange={(e: any) => handleChangeSocial(index, 'post_url', e.target.value)} value={account.post_url} type='text' />
                            </div>

                            <div className="flex items-center">
                                {/* Tombol Tambah */}
                                <AiOutlinePlusCircle
                                    className="button-add-more cursor-pointer"
                                    size={30}
                                    onClick={handleAddSocialAccount}
                                />
                                {/* Tombol Hapus */}
                                {form.social_accounts.length > 1 && (
                                    <IoIosClose
                                        className="delete-array cursor-pointer"
                                        color="red"
                                        size={30}
                                        onClick={() => handleDeleteSocialAccount(index)}
                                    />
                                )}
                            </div>



                        </div>
                    ))}
                </div>



                <div className="desc  mt-6">
                    <h1 className='mb-2'>Deskripsi</h1>
                    <textarea onChange={handleChange} placeholder='Masukan Deskripsi postingan di sini' name="content" id="content" cols={30} rows={4} value={form.content}
                        className="block p-2.5 w-full border-2  rounded-md outline-none" ></textarea>
                </div>


                <div className="flex justify-end mt-4">
                    <ButtonPrimary className='py-1 px-4 rounded-lg ' onClick={handleUpdateContent}>Kirim</ButtonPrimary>
                </div>

            </Card >
            <Toaster />
        </DefaultLayout >
    )
}

export default Page