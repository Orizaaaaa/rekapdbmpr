'use client'
import Card from '@/components/elements/card/Card'
import CardBox from '@/components/fragemnts/cardBox/CardBox'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useRouter } from 'next/navigation'
import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FaFilePen } from 'react-icons/fa6'
import { IoCloudDownloadOutline, IoLinkSharp } from 'react-icons/io5'

type Props = {}

const Page = (props: Props) => {
    const router = useRouter()
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
                            <IoLinkSharp color='white' size={24} />
                            <CiEdit className='cursor-pointer' onClick={() => router.push('editContent/1')} color='white' size={24} />
                            <FaRegTrashAlt color='white' size={24} />
                        </div>


                    </div>

                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam tenetur deleniti nemo harum a labore commodi aut laudantium, dolorum temporibus iure earum, autem excepturi laborum dolore enim nisi ducimus. Cumque.</p>
                </div>
            </Card>


        </DefaultLayout>
    )
}

export default Page