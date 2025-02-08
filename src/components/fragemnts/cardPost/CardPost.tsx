'use client'
import { ig, tiktok } from '@/app/image'
import { formatText, handleCopy } from '@/utils/helper'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { FaInstagram } from 'react-icons/fa6'
import { IoCloudDownloadOutline, IoLinkSharp } from 'react-icons/io5'
import { RiFacebookCircleLine, RiTiktokLine, RiTwitterLine } from 'react-icons/ri'

type Props = {
    image: string
    text: string
    typePost: string
    buttonView?: any
    title: string
    link?: string
}

const CardPost = ({ image, text, title, typePost, buttonView, link }: Props) => {
    const router = useRouter()

    const socialMedia = (social: any) => {
        if (social === 'instagram') {
            return <FaInstagram size={40} color='black' />
        } else if (social === 'tiktok') {
            return <RiTiktokLine size={40} color='black' />
        } else if (social === 'twitter') {
            return <RiTwitterLine size={40} color='black' />
        } else if (social === 'facebook') {
            <RiFacebookCircleLine size={40} color='black' />
        }
    }
    return (
        <div className={`rounded-lg bg-white shadow-default dark:border-strokedark `}>
            <div className=" rounded-full p-2">
                <div className='h-65 w-full relative'>
                    <img className='w-full h-full rounded-lg' src={image} alt="" />
                </div>

                <div className="content w-full">
                    <h1 className='text-md font-medium mt-3'>{formatText(title, 30)}</h1>
                    <h1 className='text-sm'>{formatText(text, 70)}</h1>

                    <div className="flex justify-between items-center my-3">
                        <div className="w-10 h-10">
                            <a target='_blank' href={link}>
                                {socialMedia(typePost)}
                            </a>
                        </div>
                        <button onClick={buttonView} className='py-2 px-4 bg-black text-white text-sm rounded-full'>View</button>
                    </div>

                    <div className="flex justify-between  bg-slate-900 rounded-lg  p-3">
                        <IoCloudDownloadOutline color='white' size={24} />
                        <IoLinkSharp className='cursor-pointer' color='white' size={24} onClick={() => handleCopy('https://akcdn.detik.net.id/visual/2021/02/25/mark-zuckerbergbritannicacom_11.jpeg?w=480&q=90')} />
                        <CiEdit className='cursor-pointer' onClick={() => router.push('contents/editContent/1')} color='white' size={24} />
                    </div>

                </div>


            </div>
        </div>
    )
}

export default CardPost