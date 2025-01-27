"use client"

import Card from "@/components/elements/card/Card";
import { article, article2, manusiaLaptop, money, outCome, user, yellowDolar } from "../image";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Image from "next/image";
import CardBox from "@/components/fragemnts/cardBox/CardBox";;
import ChartLine from "@/components/fragemnts/chartLine/ChartLine";
import useSWR from "swr";
import { fetcher } from "@/api/fetcher";
import { url } from "@/api/auth";

const Dashboard: React.FC = () => {
    const { data } = useSWR(`${url}/balance/finance-data`, fetcher, {
        keepPreviousData: true,
    });

    const getImage = (name: string) => {
        switch (name.toLowerCase()) {
            case "Total postingan bulan ini":
                return money;
            case "semua pemasukan":
                return yellowDolar;
            case "semua pengeluaran":
                return outCome;
            default:
                return money; // Gambar default jika name tidak sesuai
        }
    };

    console.log(data);


    return (
        <DefaultLayout>

            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* {data?.dataInformation?.map((item: any, index: number) => (
                    <CardBox
                        key={index}
                        image={getImage(item.name)} // Sesuaikan gambar berdasarkan name
                        value={item.Total.toLocaleString()} // Format angka untuk lebih rapi
                        title={item.name}
                    />
                ))} */}
                <CardBox
                    image={article} // Sesuaikan gambar berdasarkan name
                    value={'11'} // Format angka untuk lebih rapi
                    title={'Total postingan saat ini'}
                />
                <CardBox
                    image={user} // Sesuaikan gambar berdasarkan name
                    value={'11'} // Format angka untuk lebih rapi
                    title={'Semua User'}
                />
                <CardBox
                    image={article2} // Sesuaikan gambar berdasarkan name
                    value={'11'} // Format angka untuk lebih rapi
                    title={'Semua Postingan'}
                />
            </div>
            <ChartLine />
        </DefaultLayout>

    );
};

export default Dashboard;
