'use client'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import Card from '@/components/elements/card/Card'
import CardBox from '@/components/fragemnts/cardBox/CardBox'
import ModalAlert from '@/components/fragemnts/modal/modalAlert'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { FaRegTrashAlt } from 'react-icons/fa'
import { PiTrashLight } from "react-icons/pi";
import { FaFilePen } from 'react-icons/fa6'
import { IoCloudDownloadOutline, IoLinkSharp } from 'react-icons/io5'
import { handleCopy } from '@/utils/helper'

type Props = {}

const Page = (props: Props) => {
    const router = useRouter()
    // delete article
    const { isOpen: isWarningOpen, onOpen: onWarningOpen, onClose: onWarningClose } = useDisclosure();
    const openModalDelete = () => {
        onWarningOpen()
    }

    return (
        <DefaultLayout>
            <Card>
                <div className="grid grid-cols-2 gap-3 my-4">

                    <div>
                        <img className='rounded-lg' src="https://akcdn.detik.net.id/visual/2021/02/25/mark-zuckerbergbritannicacom_11.jpeg?w=480&q=90" alt="" />
                        <div className="flex items-center gap-5 mt-5">
                            <FaFilePen color='gray' size={20} />
                            <p>Oriza Sativa</p>
                        </div>

                        <div className="flex justify-between  bg-slate-900 rounded-lg mt-4 p-3">
                            <IoCloudDownloadOutline color='white' size={24} />
                            <IoLinkSharp className='cursor-pointer' color='white' size={24} onClick={() => handleCopy('https://akcdn.detik.net.id/visual/2021/02/25/mark-zuckerbergbritannicacom_11.jpeg?w=480&q=90')} />
                            <CiEdit className='cursor-pointer' onClick={() => router.push('editContent/1')} color='white' size={24} />
                            <PiTrashLight className='cursor-pointer' onClick={openModalDelete} color='white' size={24} />
                        </div>


                    </div>

                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam tenetur deleniti nemo harum a labore commodi aut laudantium, dolorum temporibus iure earum, autem excepturi laborum dolore enim nisi ducimus. Cumque.</p>
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