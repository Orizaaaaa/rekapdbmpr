
import Card from '@/components/elements/card/Card'
import Image from 'next/image'
import React from 'react'

type Props = {
    image: any
    value: string
    title: string
}

const CardBox = ({ image, value, title }: Props) => {
    return (
        <Card padding='p-3'>
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <p className='text-slate-500' >{title}</p>
                    <Image className='w-10 h-10' src={image} alt="dashboard" />
                </div>
                <h1 className='text-2xl font-bold my-3' >{value}</h1>
            </div>
        </Card>
    )
}

export default CardBox