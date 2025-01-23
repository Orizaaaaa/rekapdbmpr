'use client'
import { url } from '@/api/auth'
import { fetcher } from '@/api/fetcher'
import { downloadJurnal } from '@/api/transaction'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import ModalDefault from '@/components/fragemnts/modal/modal'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { dateFirst, formatDate, formatDateStr } from '@/utils/helper'
import { parseDate } from '@internationalized/date'
import { Card, DateRangePicker } from '@nextui-org/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoCloudDownloadOutline, IoLinkSharp } from 'react-icons/io5'
import useSWR from 'swr'
import { ig } from '../image'

type Props = {}

const page = (props: Props) => {
    const { data } = useSWR(`${url}/account/list`, fetcher, {
        keepPreviousData: true,
    });
    const dateNow = new Date();
    const [selectedDate, setSelectedDate] = useState(parseDate((formatDate(dateNow))))
    let [date, setDate] = React.useState({
        start: parseDate((formatDate(dateFirst))),
        end: parseDate((formatDate(dateNow))),
    });

    const startDate = formatDateStr(date.start);
    const endDate = formatDateStr(date.end);

    const [form, setForm] = useState({
        name: '',
        image: null as File | null,
        journal_date: formatDateStr(selectedDate),
        detail: [
            {
                account: '',
                debit: 0, // Updated to number
                credit: 0, // Updated to number
                note: "This is a note for the journal entry."
            },
        ],
        data_change: false,
        note: "This is a note for the journal entry."
    });


    React.useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            journal_date: formatDateStr(selectedDate),
        }));
    }, [selectedDate]);

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
                <h1 className='text-xl font-medium '>Postingan Tiktok</h1>
                <p className='text-slate-500 text-small mb-3' >Semua postingan tiktok akan ter rekap di sini, saat ini total postingan tiktok adalah 89</p>
                <div className="space-y-3 lg:space-y-0 lg:flex  justify-end gap-2 mt-3 lg:mt-0">
                    <ButtonSecondary onClick={handleDownload} className=' px-4 rounded-md'>Download dalam bentuk Excel</ButtonSecondary>
                    <DateRangePicker
                        visibleMonths={2}
                        size='sm' onChange={setDate} value={date} aria-label='datepicker' className="max-w-[284px] bg-bone border-2 border-primary rounded-lg"
                    />

                </div>

            </Card>
            <div className="my-4">
                <div className="grid grid-cols-4">
                    <div className={`rounded-lg bg-white shadow-default dark:border-strokedark `}>
                        <div className=" rounded-full p-2">
                            <div className='h-65 w-full relative'>
                                <img className='w-full h-full rounded-lg' src="https://i.pinimg.com/564x/28/e1/00/28e1001977c0a8cb5d7292a0db63d84a.jpg" alt="" />
                            </div>

                            <div className="content w-full">
                                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicin..</p>
                                <div className="flex justify-between items-center my-3">
                                    <div className="w-10 h-10">
                                        <Image className='w-full h-full' src={ig} alt="dashboard" />
                                    </div>
                                    <h1 className='py-2 px-4 bg-black text-white text-sm rounded-full'>View</h1>
                                </div>

                                <div className="flex justify-between  bg-slate-900 rounded-lg  p-3">
                                    <IoCloudDownloadOutline color='white' size={24} />
                                    <IoLinkSharp color='white' size={24} />
                                    <CiEdit color='white' size={24} />
                                </div>

                            </div>


                        </div>
                    </div>
                </div>

            </div>






        </DefaultLayout>

    )
}

export default page