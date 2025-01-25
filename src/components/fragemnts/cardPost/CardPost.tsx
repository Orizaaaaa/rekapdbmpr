import { ig, tiktok } from '@/app/image'
import Image from 'next/image'
import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoCloudDownloadOutline, IoLinkSharp } from 'react-icons/io5'

type Props = {
    image: string
    text: string
    typePost: string
    modalKlik?: any
}

const CardPost = ({ image, text, typePost, modalKlik }: Props) => {
    return (
        <div className={`rounded-lg bg-white shadow-default dark:border-strokedark `}>
            <div className=" rounded-full p-2">
                <div className='h-65 w-full relative'>
                    <img className='w-full h-full rounded-lg' src={image} alt="" />
                </div>

                <div className="content w-full">
                    <p className='text-sm'>{text}</p>

                    <div className="flex justify-between items-center my-3">
                        <div className="w-10 h-10">
                            {typePost === 'ig' ? <Image className='w-full h-full' src={ig} alt="" />
                                : <Image className='w-full h-full' src={tiktok} alt="" />}

                        </div>
                        <button onClick={modalKlik} className='py-2 px-4 bg-black text-white text-sm rounded-full'>View</button>
                    </div>

                    <div className="flex justify-between  bg-slate-900 rounded-lg  p-3">
                        <IoCloudDownloadOutline color='white' size={24} />
                        <IoLinkSharp color='white' size={24} />
                        <CiEdit color='white' size={24} />
                    </div>

                </div>


            </div>
        </div>
    )
}

export default CardPost