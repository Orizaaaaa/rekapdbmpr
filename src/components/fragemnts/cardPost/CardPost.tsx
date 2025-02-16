'use client'
import { FaInstagram } from 'react-icons/fa6'
import { IoCloudDownloadOutline, IoLinkSharp } from 'react-icons/io5'
import { RiFacebookCircleLine, RiTiktokLine, RiTwitterLine } from 'react-icons/ri'
import { CiEdit } from 'react-icons/ci'
import { formatText, handleCopy } from '@/utils/helper'
import { useRouter } from 'next/navigation'

type Props = {
    image: string
    text: string
    typePost: string
    buttonView?: () => void
    title: string
    buttonEdit: any
    link?: string
}

const CardPost = ({ image, text, title, typePost, buttonView, link, buttonEdit }: Props) => {
    const router = useRouter()

    const socialMedia = (social: string) => {
        switch (social) {
            case 'instagram':
                return <FaInstagram size={40} color='black' />
            case 'tiktok':
                return <RiTiktokLine size={40} color='black' />
            case 'twitter':
                return <RiTwitterLine size={40} color='black' />
            case 'facebook':
                return <RiFacebookCircleLine size={40} color='black' />
            default:
                return null
        }
    }

    return (
        <div className="rounded-lg bg-white shadow-default dark:border-strokedark flex flex-col h-full">
            {/* Image Section */}
            <div className="relative w-full h-65">
                <img className="w-full h-full object-cover rounded-t-lg" src={image} alt="" />
            </div>

            {/* Content Section */}
            <div className="content flex flex-col flex-1 p-2">
                <h1 className="text-md font-medium">{formatText(title, 30)}</h1>
                <p className="text-sm flex-1">{formatText(text, 70)}</p>

                <div className="flex justify-between items-center mt-3">
                    <a target="_blank" href={link} className="w-10 h-10">
                        {socialMedia(typePost)}
                    </a>
                    <button
                        onClick={buttonView}
                        className="py-2 px-4 bg-black text-white text-sm rounded-full"
                    >
                        View
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between bg-slate-900 rounded-lg p-3 mt-auto">
                <IoCloudDownloadOutline color="white" size={24} />
                <IoLinkSharp
                    className="cursor-pointer"
                    color="white"
                    size={24}
                    onClick={() => handleCopy('https://akcdn.detik.net.id/visual/2021/02/25/mark-zuckerbergbritannicacom_11.jpeg?w=480&q=90')}
                />
                <CiEdit
                    className="cursor-pointer"
                    onClick={() => router.push(`contents/editContent/${buttonEdit}`)}
                    color="white"
                    size={24}
                />
            </div>
        </div>
    )
}

export default CardPost
