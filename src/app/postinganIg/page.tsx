'use client'
import ButtonPrimary from '@/components/elements/buttonPrimary'
import ButtonSecondary from '@/components/elements/buttonSecondary'
import Card from '@/components/elements/card/Card'
import InputForm from '@/components/elements/input/InputForm'
import ModalAlert from '@/components/fragemnts/modal/modalAlert'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { Autocomplete, AutocompleteItem, DatePicker, DateRangePicker, Modal, ModalContent, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { FaPenToSquare } from 'react-icons/fa6'
import { MdOutlineDelete } from 'react-icons/md'
import { CiEdit } from "react-icons/ci";
import { deleteJurnal, downloadJurnal, getJurnalUmum, updateJurnalUmum } from '@/api/transaction'
import { parseDate } from '@internationalized/date'
import { dateFirst, formatDate, formatDateStr } from '@/utils/helper'
import useSWR from 'swr'
import { fetcher } from '@/api/fetcher'
import { IoClose, IoCloudDownloadOutline, IoLinkSharp } from 'react-icons/io5'
import { url } from '@/api/auth'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { postImage } from '@/api/imagePost'
import ModalDefault from '@/components/fragemnts/modal/modal'
import Image from 'next/image'
import { ig } from '../image'
import { BsTicketDetailed } from "react-icons/bs";

interface DropdownItem {
    label: string;
    value: string;
}

interface ItemData {
    _id: string;
    name: string;
}

const JurnalUmum = () => {
    //bug onchange  date
    const { data } = useSWR(`${url}/account/list`, fetcher, {
        keepPreviousData: true,
    });

    const dateNow = new Date();
    let [date, setDate] = React.useState({
        start: parseDate((formatDate(dateFirst))),
        end: parseDate((formatDate(dateNow))),
    });

    const [selectedDate, setSelectedDate] = useState(parseDate((formatDate(dateNow))))

    React.useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            journal_date: formatDateStr(selectedDate),
        }));
    }, [selectedDate]);

    const [total, setTotal] = useState({
        debit: 0,
        credit: 0
    })
    const [bukti, setBukti] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [totalDebit, setTotalDebit] = useState(0)
    const [totalKredit, setTotalKredit] = useState(0);
    const [isBalanced, setIsBalanced] = useState(true);
    const [id, setId] = useState("")
    const [loadingState, setLoadingState] = useState<"loading" | "error" | "idle">("idle");
    const [dataTrans, setDataTrans] = useState([])
    const startDate = formatDateStr(date.start);
    const endDate = formatDateStr(date.end);


    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: openDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen: openBukti, onOpen: onOpenBukti, onClose: onCloseBukti } = useDisclosure()
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


    const modalOpen = (item: any) => {
        setId(item._id);
        const date = new Date(item.journal_date);
        setSelectedDate(parseDate(formatDate(date)));
        setForm({
            ...form,
            name: item.name, // Ambil nilai name dari item
            image: item.image, // Ambil nilai image dari item
            detail: item.detail.map((d: any) => ({
                account: d.account, // Ambil nilai account dari detail item
                debit: d.debit, // Ambil nilai debit dari detail item
                credit: d.credit, // Ambil nilai credit dari detail item
                note: d.note // Ambil nilai note dari detail item
            })),
            data_change: item.data_change, // Ambil nilai data_change dari item
            note: item.note // Ambil nilai note dari item
        });

        // Open the modal
        onOpen();
    };

    const modalDeleteOpen = (item: any) => {
        setId(item._id);
        onOpenDelete()
    }

    const modalBuktiOpen = (item: any) => {
        setBukti(item.image)
        console.log('toll', item);

        onOpenBukti()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const updatedTransaksi = form.detail.map((trans, i) =>
            i === index ? { ...trans, [name]: name === 'debit' || name === 'credit' ? Number(value) : value } : trans
        );
        setForm({ ...form, detail: updatedTransaksi });
    };

    useEffect(() => {
        const debit = form.detail.reduce((sum, trans) => sum + (trans.debit || 0), 0);
        const kredit = form.detail.reduce((sum, trans) => sum + (trans.credit || 0), 0);

        setTotalDebit(debit);
        setTotalKredit(kredit);
        setIsBalanced(debit === kredit);
    }, [form.detail]);

    const addMoreTransaction = () => {
        setForm((prevForm) => ({
            ...prevForm,
            detail: [
                ...prevForm.detail,
                { account: '', debit: 0, credit: 0, note: 'This is a note for the journal entry.' },
            ],
        }));
    };

    const handleRemoveTransaction = (index: number) => {
        const updatedTransaksi = form.detail.filter((_, i) => i !== index);
        setForm({ ...form, detail: updatedTransaksi });
    };

    const handleDropdownSelection = (selectedValue: string, index: number) => {
        const updatedTransaksi = form.detail.map((trans, i) =>
            i === index ? { ...trans, account: selectedValue } : trans
        );
        setForm({ ...form, detail: updatedTransaksi });
    };

    const dataDropdown: DropdownItem[] = (data?.data || []).map((item: ItemData) => ({
        label: item.name,
        value: item._id
    }));

    const handleFileManager = (fileName: string) => {
        if (fileName === 'add') {
            const fileInput = document.getElementById("image-input-add") as HTMLInputElement | null;
            fileInput ? fileInput.click() : null;
        } else {
            console.log('error');

        }
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, InputSelect: string) => {
        if (InputSelect === 'add') {
            const selectedImage = e.target.files?.[0];
            setForm({ ...form, image: selectedImage || null });
        } else {
            console.log('error');

        }
    };


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

    const handleUpdate = async (e: any) => {

        e.preventDefault()
        const isAccountEmpty = form.detail.some(item => {
            return typeof item.account === 'string' && item.account.trim() === '';
        });
        const allZero = form.detail.every(trans => trans.debit === 0 && trans.credit === 0);
        if (!isBalanced) {
            setErrorMsg('Transaksi tidak balance');
        } else if (allZero) {
            setErrorMsg('Transaksi tidak dapat diproses karena debit dan kredit semuanya 0');
        } else if (form.name === '' || form.image === null) {
            setErrorMsg('Nama Transaksi dan bukti tidak boleh kosong');
        } else if (isAccountEmpty) {
            setErrorMsg('Akun tidak boleh kosong')
        } else if (form.image instanceof Blob) {
            const imageUrl = await postImage({ image: form.image });
            if (imageUrl) {
                const data = { ...form, image: imageUrl };
                updateJurnalUmum(id, data, (result: any) => {
                    if (result) {
                        getJurnalUmum(startDate, endDate, (result: any) => {
                            setErrorMsg('')
                            setDataTrans(result.data);
                            setLoadingState("idle");
                            let calculatedTotal = { debit: 0, credit: 0 };
                            result.data.forEach((item: any) => {
                                item.detail.forEach((detail: any) => {
                                    calculatedTotal.debit += detail.debit;
                                    calculatedTotal.credit += detail.credit;
                                });
                            });
                            setTotal(calculatedTotal);
                        });
                        onClose()

                    }
                })
            }
        } else {
            await updateJurnalUmum(id, form, (result: any) => {
                if (result) {
                    getJurnalUmum(startDate, endDate, (result: any) => {
                        setErrorMsg('')
                        setDataTrans(result.data);
                        setLoadingState("idle");
                        let calculatedTotal = { debit: 0, credit: 0 };
                        result.data.forEach((item: any) => {
                            item.detail.forEach((detail: any) => {
                                calculatedTotal.debit += detail.debit;
                                calculatedTotal.credit += detail.credit;
                            });
                        });
                        setTotal(calculatedTotal);
                    });
                    onClose()
                }
            })
        }

    }

    const handleDelete = async () => {
        await deleteJurnal(id, () => {
            onCloseDelete()
            getJurnalUmum(startDate, endDate, (result: any) => {
                setDataTrans(result.data);
                setLoadingState("idle");
                let calculatedTotal = { debit: 0, credit: 0 };
                result.data.forEach((item: any) => {
                    item.detail.forEach((detail: any) => {
                        calculatedTotal.debit += detail.debit;
                        calculatedTotal.credit += detail.credit;
                    });
                });
                setTotal(calculatedTotal);
            });
        })
    }

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

    console.log(form);
    console.log(dataTrans);
    console.log(total);

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



            <Modal isOpen={isOpen} onClose={onClose} size='xl' scrollBehavior='outside'>
                <ModalContent className='p-5' >
                    <h1 className='font-medium' >Update Transaksi</h1>
                    <form className='mt-1' onSubmit={handleUpdate} >
                        <InputForm className='bg-bone' htmlFor="name" title="Nama Transaksi" type="text" onChange={(e: any) => setForm({ ...form, name: e.target.value })}
                            value={form.name} />

                        <div className="space-y-2">
                            <h2>Tanggal</h2>
                            <DatePicker size='sm'
                                aria-label='datepicker'
                                value={selectedDate}
                                className=" max-w-[284px] bg-bone border-2 border-primary rounded-lg" />
                        </div>

                        {form.detail.map((trans, index) => (
                            <div key={index} className="px-1 my-2">
                                <div className="lg:flex gap-5">
                                    <div className="space-y-2">
                                        <h3>Akun</h3>
                                        <Autocomplete
                                            aria-label='dropdown'
                                            clearButtonProps={{ size: 'sm', onClick: () => handleDropdownSelection('', index) }}
                                            onSelectionChange={(e: any) => handleDropdownSelection(e, index)}
                                            defaultItems={dataDropdown}
                                            className=" w-[100%] lg:max-w-xs border-2 border-primary rounded-lg"
                                            size='sm'
                                        >
                                            {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                                        </Autocomplete>
                                    </div>
                                    <div className="flex items-center gap-5 mt-3 lg:mt-0">
                                        <InputForm
                                            className='bg-bone'
                                            htmlFor="debit"
                                            title="Debit"
                                            type="number"
                                            onChange={(e: any) => handleChange(e, index)}
                                            value={trans.debit}
                                        />
                                        <InputForm
                                            className='bg-bone'
                                            htmlFor="credit"
                                            title="Kredit"
                                            type="number"
                                            onChange={(e: any) => handleChange(e, index)}
                                            value={trans.credit}
                                        />
                                        <IoClose onClick={() => handleRemoveTransaction(index)} className="cursor-pointer" color='red' />
                                    </div>
                                </div>
                                <InputForm
                                    className='bg-bone'
                                    htmlFor="note"
                                    title="Note (opsional)"
                                    type="text"
                                    onChange={(e: any) => handleChange(e, index)}
                                    value={trans.note}
                                />
                            </div>
                        ))}

                        <div className="my-4 flex justify-end">
                            <p className={`text-small  ${isBalanced ? 'text-primary' : 'text-red'}`}>
                                {totalDebit} | {totalKredit}
                            </p>
                        </div>

                        <AiOutlinePlusCircle
                            className='button-add-more my-2 cursor-pointer'
                            size={30}
                            onClick={addMoreTransaction}
                        />


                        <div className="images ">
                            {form.image && form.image instanceof Blob ? (
                                <img className="h-[140px] md:h-[140px] w-auto mx-auto rounded-md" src={URL.createObjectURL(form.image)} />
                            ) : (
                                <div className="images border-dashed border-2 border-black rounded-md h-[130px] bg-gray-300 p-2">
                                    <button className="flex-col justify-center items-center h-full w-full " type="button" onClick={() => handleFileManager('add')} >
                                        <img className="w-auto h-full mx-auto" src={form.image ? form.image : ''} alt='cam' />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                id="image-input-add"
                                onChange={(e) => handleImageChange(e, 'add')}
                            />
                            <div className="flex justify-center gap-3 my-3">
                                <button className={`border-2 border-primary  text-primary px-4 py-2 rounded-md ${form.image === null ? 'hidden' : ''}`} type="button" onClick={() => handleFileManager('add')} >Ubah Gambar</button>
                            </div>
                        </div>
                        <p className='my-2 text-red' > <i>{errorMsg}</i> </p>
                        <div className="flex justify-end gap-3">
                            <ButtonPrimary typeButon={'submit'} className='py-2 px-5 rounded-md font-medium' >Ya</ButtonPrimary>
                            <ButtonSecondary className='py-2 px-5 rounded-md font-medium' onClick={onClose}>Tidak</ButtonSecondary>
                        </div>
                    </form>
                </ModalContent>
            </Modal>

            <ModalDefault isOpen={openBukti} onClose={onCloseBukti}>
                <div className="p-4">
                    <img className='rounded-md' src={bukti} alt="bukti" />
                </div>
            </ModalDefault>

            <ModalAlert isOpen={openDelete} onClose={onCloseDelete} >
                <h1 className='text-lg' >Apakah anda yakin akan menghapus transaksi ini ? </h1>
                <div className="flex justify-end gap-3">
                    <ButtonPrimary className='py-2 px-5 rounded-md font-medium' onClick={handleDelete}  >Ya</ButtonPrimary>
                    <ButtonSecondary className='py-2 px-5 rounded-md font-medium' onClick={onCloseDelete}>Tidak</ButtonSecondary>
                </div>
            </ModalAlert>
        </DefaultLayout>

    )
}

export default JurnalUmum