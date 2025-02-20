'use client'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import Card from '@/components/elements/card/Card'
import CaraoselImage from '@/components/fragemnts/caraoselProduct/caraoselProduct'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import Image from 'next/image'
import React, { useState } from 'react'
import { SwiperSlide } from 'swiper/react'
import { camera } from '../image'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { IoCloseCircleOutline } from 'react-icons/io5'
import InputForm from '@/components/elements/input/InputForm'
import { Autocomplete, AutocompleteItem, DatePicker } from '@nextui-org/react'
import { formatDate, formatDateStr } from '@/utils/helper'
import { parseDate } from '@internationalized/date'
import { IoIosClose } from 'react-icons/io'
import { postMediaArray } from '@/api/imagePost'
import { createContent, socialPlatforms } from '@/api/content'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
type Props = {}

interface SocialAccount {
    platform: string;
    account_id: string;
    post_url: string
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
    const dateNow = new Date();
    const [selectedDate, setSelectedDate] = useState(parseDate((formatDate(dateNow))))
    const [form, setForm] = React.useState<Content>({
        title: '',
        content: '',
        media: [] as File[],
        hashtags: [''], // Default ada satu input kosong
        mentions: [''], // Default ada satu input kosong
        scheduled_at: '',
        social_accounts: [{ platform: '', account_id: '6666666', post_url: '' }],
    });

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

    const handleCreateContent = async () => {
        setLoading(true);

        // Tampilkan toast loading
        const toastId = toast.loading("Membuat konten...");

        // Validasi semua field tidak boleh kosong
        if (
            !form.title.trim() ||
            !form.content.trim() ||
            form.media.length === 0 ||
            form.hashtags.some(tag => tag.trim() === '') ||
            form.mentions.some(mention => mention.trim() === '') ||
            !form.scheduled_at.trim() ||
            form.social_accounts.some(account => !account.platform.trim() || !account.account_id.trim() || !account.post_url.trim())
        ) {
            setLoading(false);
            toast.dismiss(toastId); // Hapus toast loading
            toast.error("Harap isi semua form", { duration: 4000 });
            return;
        }

        try {
            const urls = await postMediaArray({ media: form.media });
            console.log(urls);

            const data = { ...form, media: urls };

            createContent(data, (status: any, result: any) => {
                if (status) {
                    console.log("status", result);
                    setLoading(false);
                    toast.dismiss(toastId); // Hapus toast loading
                    toast.success("Content sukses di buat", { duration: 1000 });

                    // Tunda perpindahan halaman selama 4 detik
                    setTimeout(() => {
                        router.push("/contents");
                    }, 1000);

                    // Reset form setelah sukses
                    setForm({
                        title: "",
                        content: "",
                        media: [],
                        hashtags: [""],
                        mentions: [""],
                        scheduled_at: "",
                        social_accounts: [{ platform: "", account_id: "", post_url: "" }],
                    });
                } else {
                    setLoading(false);
                    toast.dismiss(toastId); // Hapus toast loading
                    toast.error("konten gagal di buat", { duration: 1000 });
                }
            });
        } catch (error) {
            console.error("Error creating content:", error);
            setLoading(false);
            toast.dismiss(toastId); // Hapus toast loading
            toast.error("An error occurred during the process.", { duration: 1000 });
        }
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
                        {form.media.length > 0 ? (
                            form.media.map((media, index) => (
                                <SwiperSlide key={index}>
                                    <>
                                        <div className="flex justify-center items-center" >
                                            {media.type.startsWith('image/') ? (
                                                // Tampilkan gambar
                                                <img
                                                    src={URL.createObjectURL(media)}
                                                    alt={`preview-${index}`}
                                                    className="w-auto h-[200px] relative"
                                                />
                                            ) : media.type.startsWith('video/') ? (
                                                // Tampilkan video
                                                <video
                                                    controls
                                                    src={URL.createObjectURL(media)}
                                                    className="w-auto h-[200px] relative z-999999"
                                                />
                                            ) : null}
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
                        <ButtonSecondary className='rounded-md  py-2 px-1' onClick={() => setForm(prevForm => ({ ...prevForm, media: [] as File[] }))} >Hapus Semua Media</ButtonSecondary>
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
                                    size='sm'
                                    onSelectionChange={(selected) => handleDropdownSelection(String(selected), index)}
                                >
                                    {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                                </Autocomplete>
                            </div>

                            <div className="link">
                                <InputForm htmlFor='link' title='Link' className='border-2 h-4 m-0 p-0' onChange={(e: any) => handleChangeSocial(index, 'post_url', e.target.value)} value={account.post_url} type='text' />
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
                    <ButtonPrimary className='py-1 px-4 rounded-lg ' onClick={handleCreateContent}>Kirim</ButtonPrimary>
                </div>
                <Toaster />
            </Card >

        </DefaultLayout >
    )
}

export default Page