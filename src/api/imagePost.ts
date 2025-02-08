import axios from "axios";
import { cloudName } from "./auth";


export const postImage = async ({ image }: { image: any }) => {
    const apiRequest = new FormData();
    apiRequest.append('file', image as File);  // Menggunakan 'file' sebagai parameter
    apiRequest.append('upload_preset', 'kszcrdts');  // Ganti dengan upload preset Anda

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            apiRequest
        );
        console.log(response.data.secure_url);
        return response.data.secure_url;

    } catch (error) {
        console.error('Error uploading the image', error);
    }
}

export const postMediaArray = async ({ media }: { media: (File | Blob)[] }) => {
    const urls = [];

    for (const item of media) {
        const apiRequest = new FormData();
        apiRequest.append('file', item);  // 'file' tetap sebagai parameter
        apiRequest.append('upload_preset', 'desa_cms');  // Ganti dengan upload preset Anda

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                apiRequest
            );
            console.log(response.data.secure_url);
            urls.push(response.data.secure_url);
        } catch (error) {
            console.error('Error uploading the media', error);
            urls.push(null);  // Menambahkan null jika terjadi error pada salah satu media
        }
    }

    return urls;
}

