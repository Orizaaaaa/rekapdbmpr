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
    const { data } = useSWR(`${url}/dashboard/summary`, fetcher, {
        keepPreviousData: true,
    });


    const dataDash = data?.data
    console.log(dataDash);


    return (
        <DefaultLayout>

            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <CardBox
                    image={article} // Sesuaikan gambar berdasarkan name
                    value={dataDash?.totalContentThisMonth} // Format angka untuk lebih rapi
                    title={'Total postingan saat ini'}
                />
                <CardBox
                    image={user} // Sesuaikan gambar berdasarkan name
                    value={dataDash?.totalUsers} // Format angka untuk lebih rapi
                    title={'Semua User'}
                />
                <CardBox
                    image={article2} // Sesuaikan gambar berdasarkan name
                    value={dataDash?.totalContent} // Format angka untuk lebih rapi
                    title={'Semua Postingan'}
                />
            </div>
            <ChartLine />
        </DefaultLayout>

    );
};

export default Dashboard;
