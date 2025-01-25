'use client'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import Card from '@/components/elements/card/Card'
import InputForm from '@/components/elements/input/InputForm'
import ModalAlert from '@/components/fragemnts/modal/modalAlert'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { Autocomplete, AutocompleteItem, DatePicker, DateRangePicker, Modal, ModalContent, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { deleteJurnal, downloadJurnal, getJurnalUmum, updateJurnalUmum } from '@/api/transaction'
import { parseDate } from '@internationalized/date'
import { dateFirst, formatDate, formatDateStr } from '@/utils/helper'
import useSWR from 'swr'
import { fetcher } from '@/api/fetcher'
import { url } from '@/api/auth'
import CardPost from '@/components/fragemnts/cardPost/CardPost'

interface DropdownItem {
    label: string;
    value: string;
}

interface ItemData {
    _id: string;
    name: string;
}

const JurnalUmum = () => {

    const { data } = useSWR(`${url}/account/list`, fetcher, {
        keepPreviousData: true,
    });

    const dateNow = new Date();
    let [date, setDate] = React.useState({
        start: parseDate((formatDate(dateFirst))),
        end: parseDate((formatDate(dateNow))),
    });


    const [total, setTotal] = useState({
        debit: 0,
        credit: 0
    })

    const [loadingState, setLoadingState] = useState<"loading" | "error" | "idle">("idle");
    const [dataTrans, setDataTrans] = useState([])
    const startDate = formatDateStr(date.start);
    const endDate = formatDateStr(date.end);






    useEffect(() => {
        setLoadingState("loading");
        getJurnalUmum(startDate, endDate, (result: any) => {
            setDataTrans(result.data);
            setLoadingState("idle");

            // Hitung total setelah data di-set
            let calculatedTotal = { debit: 0, credit: 0 };
            result.data.forEach((item: any) => {
                item.detail.forEach((detail: any) => {
                    calculatedTotal.debit += detail.debit;
                    calculatedTotal.credit += detail.credit;
                });
            });
            setTotal(calculatedTotal);
        });
    }, [startDate, endDate]);


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


    console.log(loadingState);
    console.log(total);
    console.log(dataTrans);
    console.log(data);



    return (
        <DefaultLayout>
            <Card>
                <h1 className='text-xl font-medium '>Postingan Instagram</h1>
                <p className='text-slate-500 text-small mb-3' >Semua postingan instagram akan ter rekap di sini, saat ini total postingan instagram adalah 89</p>
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
                    <CardPost image='https://www.deheus.id/siteassets/animal-nutrition/swine/de-heus-animal-nutrition_animals_swines_-pigs_sows_in_stables-1.jpg' typePost='ig' text='Lorem ipsum, dolor sit amet consectetur adipisicing elit...' />
                </div>

            </div>
        </DefaultLayout>

    )
}

export default JurnalUmum