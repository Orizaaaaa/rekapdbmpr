'use client'
import { postImage } from '@/api/imagePost'
import { camera } from '@/app/image'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import InputForm from '@/components/elements/input/InputForm'
import { Spinner } from '@nextui-org/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useRef, useState } from 'react'

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const EditorContent = ({ desc }: any) => {
    const [errorMsg, setErrorMsg] = useState({
        title: '',
        description: '',
        image: '',
    });

    const pathname = usePathname()
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [form, setForm] = useState({
        title: '',
        description: desc,
        image: null as File | null,
    })

    /* Function to handle the changes in the editor */
    const editorContentRef = useRef(form.description);
    const editorInstanceRef = useRef(null)

    // Modifikasi pada handleSave untuk menjamin pembaruan state selesai
    const handleSave = (): Promise<void> => {
        return new Promise((resolve) => {
            setForm((prevForm) => {
                // Pastikan form.description diperbarui dengan nilai terbaru dari editor
                return {
                    ...prevForm,
                    description: editorContentRef.current,
                };
            });
            resolve(); // Selesaikan promise setelah setForm dipanggil
        });
    };

    const handleChangeEditor = (newContent: string) => {
        editorContentRef.current = newContent;
    };


    //input gambar
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
            setForm({ ...form, image: selectedImage || null });
        } else {
            console.log('error');

        }
    };


    /* The most important point */
    const config: any = useMemo(
        () => ({
            /* Custom image uploader button configuration to accept image and convert it to base64 format */
            uploader: {
                insertImageAsBase64URI: true,
                imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'] // this line is not much important, use if you only strictly want to allow some specific image format
            },
        }),
        []
    );



    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    console.log(form);

    // menghilangkan html deskrisi
    const isDescriptionEmpty = (description: string) => {
        // Buat DOMParser untuk parsing string HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(description, 'text/html');

        // Hapus semua tag <br> dan lihat apakah tag <p> atau lainnya kosong
        const content = doc.body.textContent?.trim();

        // Jika setelah membersihkan masih kosong, berarti deskripsi kosong
        return !content;
    };


    // handle submit article
    const handleCreateArticle = async () => {
        setLoading(true);
        await handleSave();
        // Gunakan isDescriptionEmpty untuk mengecek apakah deskripsi kosong
        const errors = {
            title: form.title.trim() ? '' : '*Judul content tidak boleh kosong',
            description: !isDescriptionEmpty(form.description) ? '' : '*Deskripsi tidak boleh kosong',
            image: form.image ? '' : '*Gambar tidak boleh kosong',
        };

        setErrorMsg(errors);

        // Cek apakah ada error
        const hasError = Object.values(errors).some((errorMsg) => errorMsg !== '');
        if (hasError) {
            setLoading(false);
            return; // Hentikan proses jika ada error
        }

        try {
            // Upload image dan dapatkan URL
            const imageUrl = await postImage({ image: form.image });

            if (imageUrl) {
                // Buat form yang akan dikirim
                const formSubmit = {
                    ...form,
                    image: imageUrl,
                    description: editorContentRef.current,
                };

                // Kirim data ke server

            } else {
                // Gagal mengunggah gambar
                setLoading(false);
            }
        } catch (error) {
            console.error("Error creating article:", error);
            setLoading(false);
        }
    };



    console.log(form);
    console.log(errorMsg);

    return (
        <>
            {/* Below is a basic html page and we use Tailwind css to style */}
            <main>
                <div >
                    <div >
                        <div className="images ">

                            {form.image && form.image instanceof Blob ? (
                                <img className="h-[170px] md:h-[300px] w-auto mx-auto rounded-md" src={URL.createObjectURL(form.image)} />
                            ) : (
                                <>
                                    <div className="images border-dashed border-2 border-black rounded-md h-[200px] bg-gray-300">
                                        <button className="flex-col justify-center items-center h-full w-full " type="button" onClick={() => handleFileManager('add')} >
                                            <Image alt='image' className="w-20 h-20 mx-auto" src={camera} />
                                            <p>*Masukan gambar sebagai thumbail content</p>
                                        </button>
                                    </div>
                                    <p className='text-red text-sm mt-1'>{errorMsg.image}</p>
                                </>

                            )}

                            <input
                                type="file"
                                className="hidden"
                                id="image-input-add"
                                onChange={(e) => handleImageChange(e, 'add')}
                            />

                            <div className="flex justify-center items-center my-3">
                                <button className={`border-2 border-primary  text-primary px-4 py-2 rounded-md ${form.image === null ? 'hidden' : ''}`} type="button" onClick={() => handleFileManager('add')} >Ubah Gambar</button>
                            </div>
                        </div>
                        {/* This is the main initialization of the Jodit editor */}
                        <InputForm htmlFor="title" placeholder='Masukan judul content' type="text" onChange={handleChange} value={form.title} />
                        <JoditEditor
                            ref={editorInstanceRef}
                            value={editorContentRef.current}       // This is important
                            config={config}         // Only use when you declare some custom configs
                            onChange={(e) => handleChangeEditor(e)} // Handle the changes
                            className="w-full h-[70%] text-black bg-white"
                        />
                        <style>
                            {`.jodit-wysiwyg{min-height: 300px !important;}`}
                        </style>

                    </div>
                    <p className='text-red text-sm'>{errorMsg.description}</p>


                    <div className="flex justify-end w-full my-4">
                        <ButtonPrimary onClick={handleCreateArticle}
                            className='px-4 py-2 rounded-md flex justify-center items-center'>{loading ? <Spinner className={`w-5 h-5 mx-8`} size="sm" color="white" /> : 'Buat content'} </ButtonPrimary>
                    </div>

                </div>

            </main>
        </>
    )
}

export default EditorContent