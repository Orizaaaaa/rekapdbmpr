'use client'
import { url } from '@/api/auth'
import { fetcher } from '@/api/fetcher'
import { downloadJurnal } from '@/api/transaction'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import ModalDefault from '@/components/fragemnts/modal/modal'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { dateFirst, formatDate, formatDateStr } from '@/utils/helper'
import { parseDate } from '@internationalized/date'
import { Card, DateRangePicker, useDisclosure } from '@nextui-org/react'
import React, { useState } from 'react'

import CardPost from '@/components/fragemnts/cardPost/CardPost'
import { useRouter } from 'next/navigation'

type Props = {}

const Page = (props: Props) => {
    // const { data } = useSWR(`${url}/account/list`, fetcher, {
    //     keepPreviousData: true,
    // });
    const router = useRouter()
    const dateNow = new Date();
    let [date, setDate] = React.useState({
        start: parseDate((formatDate(dateFirst))),
        end: parseDate((formatDate(dateNow))),
    });

    const startDate = formatDateStr(date.start);
    const endDate = formatDateStr(date.end);





    const handleDownload = () => {
        downloadJurnal(startDate, endDate, (result: any) => {
            if (result instanceof Blob) {
                // Jika hasil adalah Blob, kita lanjutkan dengan download
                const url = window.URL.createObjectURL(result);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `jurnal-${startDate}-${endDate}.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                console.log('Download success');
            } else {
                // Jika tidak, anggap itu sebagai error
                console.error('Download failed:', result);
            }
        });
    };

    return (

        <DefaultLayout>
            <Card className='p-3'>
                <h1 className='text-xl font-medium '>Postingan </h1>
                <p className='text-slate-500 text-small mb-3' >Semua postingan akan ter rekap di sini, saat ini total postingan adalah 89</p>
                <div className="space-y-3 lg:space-y-0 lg:flex  justify-end gap-2 mt-3 lg:mt-0">
                    <ButtonSecondary onClick={handleDownload} className=' px-4 rounded-md'>Download dalam bentuk Excel</ButtonSecondary>
                    <DateRangePicker
                        visibleMonths={2}
                        size='sm' onChange={setDate} value={date} aria-label='datepicker' className="max-w-[284px] bg-bone border-2 border-primary rounded-lg"
                    />

                </div>

            </Card>

            <div className="my-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <CardPost buttonView={() => router.push('/contents/8')}
                        image='https://akcdn.detik.net.id/visual/2021/02/25/mark-zuckerbergbritannicacom_11.jpeg?w=480&q=90' typePost='tiktok' text='Mark Elliot Zuckerberg adalah seorang...' />
                    <CardPost buttonView={() => router.push('/contents/8')} image='https://www.family.abbott/content/dam/an/familyabbott/id-id/ensure/tools-and-resources/tips-on-how-to-live-strong/fitness/light-moderate-and-vigorous-physical-activities/143_Mastheadl.jpg.jpg' typePost='ig' text='Olahraga adalah salah satu kegiatan...' />
                </div>

            </div>

        </DefaultLayout>

    )
}

export default Page