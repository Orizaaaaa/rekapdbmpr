'use client'
import { url } from '@/api/auth'
import { fetcher } from '@/api/fetcher'
import { downloadJurnal } from '@/api/transaction'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import ModalDefault from '@/components/fragemnts/modal/modal'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { dateFirst, formatDate, formatDateStr } from '@/utils/helper'
import { parseDate } from '@internationalized/date'
import { Autocomplete, AutocompleteItem, Card, DateRangePicker, useDisclosure } from '@nextui-org/react'
import React, { useState } from 'react'
import useSWR from "swr";
import CardPost from '@/components/fragemnts/cardPost/CardPost'
import { useRouter } from 'next/navigation'
import { socialPlatforms } from '@/api/content'

type Props = {}

const Page = (props: Props) => {
    const { data } = useSWR(`${url}/content/`, fetcher, {
        keepPreviousData: true,
    });
    const [form, setForm] = React.useState({
        name: [] as File[],
        link: '',
        description: '',
        typeContent: 'instagram'
    })
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

    console.log(data)
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

                <Autocomplete
                    aria-label='none'
                    isRequired
                    className="max-w-xs rounded-lg border-2 "
                    defaultItems={socialPlatforms}
                    size='sm'
                    defaultSelectedKey={'instagram'}
                >
                    {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                </Autocomplete>

            </Card>

            <div className="my-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {data?.data?.map((item: any, index: number) => {
                        const typePost = item.social_accounts?.[0]?.platform || 'unknown';
                        const url = item.social_accounts?.[0]?.post_url || 'unknown';

                        return (
                            <CardPost
                                key={index}
                                link={url}
                                buttonView={() => router.push(`/contents/${item.id}`)}
                                title={item.title}
                                image={item?.media?.[0]}
                                typePost={typePost}
                                text={item.content}
                                buttonEdit={item.id}
                            />
                        );
                    })}



                </div>

            </div>

        </DefaultLayout>

    )
}

export default Page