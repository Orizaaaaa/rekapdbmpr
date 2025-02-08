import { axiosInterceptor } from "./axiosInterceptor";

export const createContent = async (form: any, callback: any) => {
    await axiosInterceptor.post('/content', form)
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
            console.log(err);

        });

}

export const socialPlatforms = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'tiktok', label: 'TikTok' },
];