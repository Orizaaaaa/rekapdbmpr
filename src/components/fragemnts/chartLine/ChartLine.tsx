'use client';

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetcher } from "@/api/fetcher";
import { url } from "@/api/auth";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options: ApexOptions = {
    legend: {
        show: false,
        position: "top",
        horizontalAlign: "left",
    },
    colors: ["#80CAEE", "#3A7D44"],
    chart: {
        fontFamily: "Satoshi, sans-serif",
        height: 395,
        type: "area",
        dropShadow: {
            enabled: true,
            color: "#623CEA14",
            top: 10,
            blur: 4,
            left: 0,
            opacity: 0.1,
        },
        toolbar: { show: false },
    },
    stroke: { width: [2, 2], curve: "straight" },
    grid: {
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    markers: {
        size: 4,
        colors: "#fff",
        strokeColors: ["#80CAEE", "#3A7D44"],
        strokeWidth: 3,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        hover: { sizeOffset: 5 },
    },
    xaxis: {
        type: "category",
        categories: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: { min: 0, max: undefined },
};

interface ChartOneState {
    series: {
        name: string;
        data: number[];
    }[];
}

const ChartLine: React.FC = () => {
    const { data, error } = useSWR(`${url}/dashboard/content-per-month`, fetcher);

    const [state, setState] = useState<ChartOneState>({
        series: [
            { name: "Total Postingan", data: new Array(12).fill(0) },
            { name: "Total User", data: new Array(12).fill(0) },
        ],
    });
    console.log(data);

    useEffect(() => {
        if (data?.data?.monthlyStats) {
            const totalContentData = new Array(12).fill(0);
            const totalUsersData = new Array(12).fill(0);

            data?.data?.monthlyStats.forEach((item: any) => {
                const monthIndex = item.month - 1; // Bulan dalam array dimulai dari 0
                totalContentData[monthIndex] = item.totalContent;
                totalUsersData[monthIndex] = item.totalUsers;
            });

            setState({
                series: [
                    { name: "Total Postingan", data: totalContentData },
                    { name: "Total User", data: totalUsersData },
                ],
            });
        }
    }, [data]);

    return (
        <div className="col-span-12 mt-5 rounded-lg bg-white px-5 pb-5 pt-7.5 shadow-default sm:px-7.5 xl:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                    <div className="flex min-w-47.5">
                        <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#80CAEE]">
                            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#80CAEE]"></span>
                        </span>
                        <div className="w-full">
                            <p className="font-semibold text-[#80CAEE]">Total Postingan</p>
                        </div>
                    </div>
                    <div className="flex min-w-47.5">
                        <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#3A7D44]">
                            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#3A7D44]"></span>
                        </span>
                        <div className="w-full">
                            <p className="font-semibold text-[#3A7D44]">Total User</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div id="chartOne" className="-ml-5">
                    <ReactApexChart
                        options={options}
                        series={state.series}
                        type="area"
                        height={350}
                        width={"100%"}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChartLine;
