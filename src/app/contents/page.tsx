'use client'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { dateFirst, formatDate, formatDateStr } from '@/utils/helper'
import { parseDate } from '@internationalized/date'
import { Autocomplete, AutocompleteItem, Card, DateRangePicker, useDisclosure } from '@nextui-org/react'
import React, { use, useEffect, useState } from 'react'
import CardPost from '@/components/fragemnts/cardPost/CardPost'
import { useRouter } from 'next/navigation'
import { deleteContent, downloadRekap, getContents, socialPlatforms } from '@/api/content'
import toast, { Toaster } from 'react-hot-toast';
import ModalAlert from '@/components/fragemnts/modal/modalAlert'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import useSWR from 'swr'
import { fetcher } from '@/api/fetcher'
import { url } from '@/api/auth'

type Props = {}
interface SocialAccount {
    platform: string;
    post_url: string;
    status: string;
    _id: string;
}
interface Post {
    content: string;
    createdAt: string;
    hashtags: string[];
    id: string;
    media: string[];
    mentions: string[];
    scheduled_at: string;
    social_accounts: SocialAccount[];
    status: string;
    title: string;
    updatedAt: string;
    user_id: {
        _id: string;
        username: string;
        email: string;
    };
}
const Page = (props: Props) => {
    const { data: dataTotal } = useSWR(`${url}/dashboard/summary`, fetcher, {
        keepPreviousData: true,
    });
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() + 1);
    const [id, setId] = useState('')
    const [data, setData] = useState([])
    const router = useRouter()
    let [date, setDate] = React.useState({
        start: parseDate((formatDate(dateFirst))),
        end: parseDate((formatDate(dateNow))),
    });

    const startDate = formatDateStr(date.start);
    const endDate = formatDateStr(date.end);



    useEffect(() => {

        getContents(startDate, endDate, (result: any) => {
            setData(result.data);
            console.log(result.data);

        });

    }, [startDate, endDate]);



    const handleDownload = () => {
        downloadRekap(startDate, endDate, (result: any) => {
            if (result instanceof Blob) {
                // Jika hasil adalah Blob, kita lanjutkan dengan download
                const url = window.URL.createObjectURL(result);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `rekapdbmr-${startDate}-${endDate}.xlsx`);
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


    const { isOpen: isWarningOpen, onOpen: onWarningOpen, onClose: onWarningClose } = useDisclosure();

    const openModalDelete = (id: string) => {
        setId(id)
        onWarningOpen()
    }


    const handleDelete = async () => {
        // Tampilkan toast loading sebelum proses delete dimulai
        const toastId = toast.loading("Menghapus konten...");

        try {
            // Panggil fungsi deleteContent
            await deleteContent(id, (result: any) => {
                console.log(result);

                // Hapus toast loading
                toast.dismiss(toastId);

                if (result?.response?.data.message === "Content not found") {
                    // Tampilkan toast khusus jika konten tidak ditemukan atau bukan milik user
                    toast.error("Kamu tidak dapat menghapus postingan orang lain!", { duration: 4000 });
                    onWarningClose();
                } else if (result) {
                    // Tampilkan toast sukses
                    toast.success("Konten berhasil dihapus!", { duration: 4000 });

                    // Ambil data terbaru setelah delete
                    getContents(startDate, endDate, (result: any) => {
                        setData(result.data);
                        console.log(result.data);
                    });

                    // Tutup modal atau tampilan peringatan
                    onWarningClose();
                } else {
                    // Tampilkan toast error jika delete gagal
                    toast.error("Gagal menghapus konten!", { duration: 4000 });
                }
            });
        } catch (error) {
            // Hapus toast loading
            toast.dismiss(toastId);

            // Tampilkan toast error jika terjadi exception
            toast.error("Terjadi kesalahan saat menghapus konten!", { duration: 4000 });
            console.error("Error deleting content:", error);
        }
    };

    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const handlePlatformChange = (value: any) => {
        setSelectedPlatform(value);
    };

    const filteredData = dataTotal
        ? data?.filter((item: Post) =>
            selectedPlatform === null // Jika tidak ada platform yang dipilih
                ? true // Tampilkan semua data
                : item?.social_accounts?.some((account: SocialAccount) => account?.platform === selectedPlatform) // Filter berdasarkan platform
        )
        : [];

    console.log(filteredData)
    return (

        <DefaultLayout>
            <Card className='p-3'>
                <h1 className='text-xl font-medium '>Postingan </h1>
                <p className='text-slate-500 text-small mb-3' >{`Semua postingan akan ter rekap di sini, saat ini total postingan adalah ${dataTotal?.data?.totalContent}`} </p>
                <div className="space-y-3 lg:space-y-0 lg:flex  justify-end gap-2 mt-3 lg:mt-0">
                    <ButtonSecondary onClick={handleDownload} className=' px-4 rounded-md w-full lg:w-auto'>Download dalam bentuk Excel</ButtonSecondary>
                    <DateRangePicker
                        visibleMonths={2}
                        size='sm' onChange={setDate} value={date} aria-label='datepicker' className="lg:max-w-[284px] bg-bone border-2 border-primary rounded-lg"
                    />

                </div>

                <Autocomplete
                    aria-label='none'
                    isRequired
                    className="max-w-xs rounded-lg border-2 mt-2 lg:mt-0"
                    defaultItems={socialPlatforms}
                    size='sm'
                    onSelectionChange={handlePlatformChange}
                    placeholder='Filter berdasarkan platform'
                >
                    {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                </Autocomplete>

            </Card>

            <div className="my-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {filteredData?.map((item: any, index: number) => {
                        const typePost = item.social_accounts?.[0]?.platform || 'unknown';
                        const url = item.social_accounts?.[0]?.post_url || 'unknown';

                        return (
                            <CardPost
                                buttonModalAlert={() => openModalDelete(item.id)}
                                key={index}
                                idDelete={item.id}
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
            <ModalAlert isOpen={isWarningOpen} onClose={onWarningClose}>
                <h1>Apakah anda yakin ingin menghapus postingan ini ? </h1>

                <div className="flex gap-3 justify-end">
                    <ButtonSecondary onClick={handleDelete} className='px-4 py-1 rounded-md'>Ya</ButtonSecondary>
                    <ButtonPrimary onClick={onWarningClose} className='px-4 py-1 rounded-md'>Batal</ButtonPrimary>
                </div>
            </ModalAlert>
            <Toaster />
        </DefaultLayout>

    )
}

export default Page