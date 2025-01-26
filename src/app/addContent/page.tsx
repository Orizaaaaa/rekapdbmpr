'use client'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import Card from '@/components/elements/card/Card'
import CaraoselImage from '@/components/fragemnts/caraoselProduct/caraoselProduct'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import Image from 'next/image'
import React from 'react'
import { SwiperSlide } from 'swiper/react'
import { camera } from '../image'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import { IoCloseCircleOutline } from 'react-icons/io5'
import InputForm from '@/components/elements/input/InputForm'

type Props = {}

const Page = (props: Props) => {
    const [form, setForm] = React.useState({
        name: [] as File[],
        link: '',
        description: '',
        typeContent: 'instagram'
    })
    const [errorMsg, setErrorMsg] = React.useState({
        image: '',
        imageUpdate: ''
    })

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>, InputSelect: string) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        const allowedImageTypes = ['image/png', 'image/jpeg'];
        const allowedVideoTypes = ['video/mp4'];
        const maxImageSize = 5 * 1024 * 1024; // 5MB
        const maxVideoSize = 20 * 1024 * 1024; // 20MB

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
                    media: `*Ukuran file maksimal ${isImage ? '5MB' : '20MB'}`,
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
                name: [...prevState.name, selectedFile],
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
                    mediaUpdate: `*Ukuran file maksimal ${isImage ? '5MB' : '20MB'}`,
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
                name: prevState.name.filter((_, i) => i !== index),
            }));
        }
    };


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const buttonChangedTypeContent = (name: string) => {
        if (name === 'tiktok') {
            setForm({ ...form, typeContent: 'tiktok' })
        } else {
            setForm({ ...form, typeContent: 'instagram' })
        }
    }

    console.log(errorMsg);
    console.log(form);


    return (
        <DefaultLayout>
            <Card padding='p-3'>

                <div className="flex gap-3">
                    <button onClick={() => buttonChangedTypeContent('instagram')}
                        className={`${form.typeContent === 'instagram' ? 'bg-black text-white' : 'border-black  text-black bg-white'} py-1 px-4 rounded-lg border-2
                         `}>
                        Instagram
                    </button>

                    <button onClick={() => buttonChangedTypeContent('tiktok')}
                        className={`${form.typeContent === 'tiktok  ' ? 'bg-black text-white' : 'border-black  text-black bg-white'} py-1 px-4 rounded-lg border-2
                        `}>
                        Tiktok
                    </button>
                </div>

                <div className="content mt-4 mb-2">
                    <CaraoselImage>
                        {form.name.length > 0 ? (
                            form.name.map((media, index) => (
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
                        <ButtonSecondary className='rounded-md  py-2 px-1' onClick={() => setForm(prevForm => ({ ...prevForm, name: [] }))} >Hapus Semua</ButtonSecondary>
                    </div>

                </div>

                <InputForm className='border-2 ' onChange={handleChange} value={form.link} placeholder='Masukan Link' htmlFor='link' type='text' />
                <textarea onChange={handleChange} placeholder='Masukan Deskripsi postingan di sini' name="description" id="description" cols={30} rows={4} value={form.description}
                    className="block p-2.5 w-full border-2  rounded-md outline-none " ></textarea>
                <div className="flex justify-end mt-4">
                    <ButtonPrimary className='py-1 px-4 rounded-lg '>Kirim</ButtonPrimary>
                </div>

            </Card>
        </DefaultLayout>
    )
}

export default Page