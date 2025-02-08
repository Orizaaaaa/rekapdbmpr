'use client'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import Card from '@/components/elements/card/Card'
import CardBox from '@/components/fragemnts/cardBox/CardBox'
import ModalAlert from '@/components/fragemnts/modal/modalAlert'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useDisclosure } from '@nextui-org/react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { FaRegTrashAlt } from 'react-icons/fa'
import { PiTrashLight } from "react-icons/pi";
import { FaFilePen } from 'react-icons/fa6'
import { IoCloudDownloadOutline, IoLinkSharp } from 'react-icons/io5'
import { handleCopy } from '@/utils/helper'
import useSWR from 'swr'
import { url } from '@/api/auth'
import { fetcher } from '@/api/fetcher'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'

type Props = {}

const Page = (props: Props) => {
    const router = useRouter()
    const { id }: any = useParams()
    const { data } = useSWR(`${url}/content/${id}`, fetcher, {
        keepPreviousData: true,
    });
    // delete article
    const { isOpen: isWarningOpen, onOpen: onWarningOpen, onClose: onWarningClose } = useDisclosure();
    const openModalDelete = () => {
        onWarningOpen()
    }
    const dataArray = data?.data
    console.log(dataArray);

    return (
        <DefaultLayout>
            <Card>
                <div className="grid grid-cols-2 gap-3 my-4">

                    <div>
                        <div className="cover group relative" >
                            <Swiper
                                spaceBetween={10}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[Pagination]}
                                className="mySwiper h-full rounded-lg"
                            >
                                {dataArray?.media?.map((image: any, index: any) => (
                                    <SwiperSlide key={index}>
                                        <div className="relative mx-auto">
                                            <img
                                                src={image} // Mengambil URL langsung dari `image`
                                                alt={`preview-${image}`}
                                                className="w-auto h-[50vh]  rounded-md  mx-auto"
                                            />

                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <div className="flex items-center gap-5 mt-5">
                            <FaFilePen color='gray' size={20} />
                            <p>Oriza Sativa</p>
                        </div>

                        <div className="flex justify-between  bg-slate-900 rounded-lg mt-4 p-3">
                            <IoCloudDownloadOutline color='white' size={24} />
                            <IoLinkSharp className='cursor-pointer' color='white' size={24} onClick={() => handleCopy('https://akcdn.detik.net.id/visual/2021/02/25/mark-zuckerbergbritannicacom_11.jpeg?w=480&q=90')} />
                            <CiEdit className='cursor-pointer' onClick={() => router.push(`editContent/${id}`)} color='white' size={24} />
                            <PiTrashLight className='cursor-pointer' onClick={openModalDelete} color='white' size={24} />
                        </div>


                    </div>
                    <div className="text-content">
                        <h1 className='text-lg font-semibold' > {dataArray?.title}</h1>
                        <p>{dataArray?.content} {dataArray?.mentions?.map((tag: string, index: number) => (
                            <span key={index} className=" py-1 bg-gray-200 rounded-md text-sm text-zinc-400">
                                @{tag}
                            </span>
                        ))}</p>
                        <div className="hastag mt-5">
                            {dataArray?.hashtags?.map((tag: string, index: number) => (
                                <span key={index} className=" py-1 pr-2 bg-gray-200 rounded-md text-sm text-zinc-400">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </Card>

            <ModalAlert isOpen={isWarningOpen} onClose={onWarningClose}>
                <h1>Apakah anda yakin ingin menghapus postingan ini ? </h1>

                <div className="flex gap-3 justify-end">
                    <ButtonPrimary onClick={onWarningClose} className='px-4 py-2 rounded-md'>Batal</ButtonPrimary>
                    {/* <ButtonDelete onClick={handleDelete}
                        className='px-4 py-2 rounded-md flex justify-center items-center'
                    >{loadingDelete ? <Spinner className={`w-5 h-5 mx-8`} size="sm" color="white" /> : 'Ya, Hapus'}</ButtonDelete> */}
                </div>
            </ModalAlert>
        </DefaultLayout >
    )
}

export default Page