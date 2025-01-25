'use client'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import Card from '@/components/elements/card/Card'
import CaraoselImage from '@/components/fragemnts/caraoselProduct/caraoselProduct'
import EditorContent from '@/components/fragemnts/editorContent/EditorContent'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import Image from 'next/image'
import React from 'react'
import { SwiperSlide } from 'swiper/react'
import { camera } from '../image'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import { IoCloseCircleOutline } from 'react-icons/io5'
import InputForm from '@/components/elements/input/InputForm'

type Props = {}

const page = (props: Props) => {
    const [form, setForm] = React.useState({
        name: [] as File[],
        link: '',
        description: ''
    })
    const [errorMsg, setErrorMsg] = React.useState({
        image: '',
        imageUpdate: ''
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, InputSelect: string) => {
        const selectedImage = e.target.files?.[0];

        if (!selectedImage) {
            console.log('No file selected');
            return;
        }

        if (InputSelect === 'add') {
            // Validasi tipe file
            const allowedTypes = ['image/png', 'image/jpeg'];
            if (!allowedTypes.includes(selectedImage.type)) {
                setErrorMsg((prev) => ({
                    ...prev,
                    image: '*Hanya file PNG dan JPG yang diperbolehkan',
                }));
                return;
            }

            // Validasi ukuran file (dalam byte, 5MB = 5 * 1024 * 1024)
            const maxSize = 5 * 1024 * 1024;
            if (selectedImage.size > maxSize) {
                setErrorMsg((prev) => ({
                    ...prev,
                    image: '*Ukuran file maksimal 5 MB',
                }));
                return;
            }

            // Hapus pesan error jika file valid
            setErrorMsg((prev) => ({
                ...prev,
                image: '',
            }));

            // Update state form dengan file yang valid
            setForm((prevState) => ({
                ...prevState,
                name: [...prevState.name, selectedImage],
            }));
        } else {

            // Validasi tipe file
            const allowedTypes = ['image/png', 'image/jpeg'];
            if (!allowedTypes.includes(selectedImage.type)) {
                setErrorMsg((prev) => ({
                    ...prev,
                    imageUpdate: '*Hanya file PNG dan JPG yang diperbolehkan',
                }));
                return;
            }

            // Validasi ukuran file (dalam byte, 5MB = 5 * 1024 * 1024)
            const maxSize = 5 * 1024 * 1024;
            if (selectedImage.size > maxSize) {
                setErrorMsg((prev) => ({
                    ...prev,
                    imageUpdate: '*Ukuran file maksimal 5 MB',
                }));
                return;
            }

            // Hapus pesan error jika file valid
            setErrorMsg((prev) => ({
                ...prev,
                imageUpdate: '',
            }));


        }
    };


    const deleteArrayImage = (index: number, type: string) => {
        if (type === 'add') {
            setForm(prevState => ({
                ...prevState,
                name: prevState.name.filter((_, i) => i !== index)
            }));
        }

    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    console.log(errorMsg);

    return (
        <DefaultLayout>
            <Card padding='p-3'>

                <div className="flex gap-3">
                    <ButtonSecondary className='py-1 px-4 rounded-lg'>
                        Instagram
                    </ButtonSecondary>
                    <ButtonSecondary className='py-1 px-4 rounded-lg'>
                        Tiktok
                    </ButtonSecondary>
                </div>

                <div className="content mt-4 mb-2">
                    <CaraoselImage>
                        {form.name.length > 0 ? (
                            form.name.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <>
                                        <div className="flex justify-center items-center " style={{ pointerEvents: 'none' }}>
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`preview-${index}`}
                                                className="w-auto h-[200px] relative"
                                            />
                                        </div>
                                        <button onClick={() => deleteArrayImage(index, 'add')} className="button-delete array image absolute top-0 right-0 z-10 "  ><IoCloseCircleOutline color="red" size={34} /></button>
                                    </>
                                </SwiperSlide>
                            ))
                        ) : (
                            <div className='flex justify-center border-2 border-dashed'>
                                <Image className="w-auto h-[200px] relative " src={camera} alt="image"></Image>
                            </div>
                        )}

                    </CaraoselImage>
                    <div className="grid grid-cols-2 justify-between mt-5 gap-2">
                        <ButtonPrimary className='rounded-md relative cursor-pointer py-2 px-1' >Tambah Konten
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="image-input-add"
                                onChange={(e) => handleImageChange(e, 'add')}
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

export default page