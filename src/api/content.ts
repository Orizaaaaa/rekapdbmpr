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

export const getDetailContent = async (id: string, callback: any) => {
    await axiosInterceptor.get(`/content/${id}`)
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
            console.log(err);
        });
}




export const deleteContent = async (id: string, callback: any) => {
    await axiosInterceptor.delete(`/content/${id}`)
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
            console.log(err);
        });
}

export const updateContent = async (id: string, form: any, callback: any) => {
    await axiosInterceptor.put(`/content/${id}`, form)
        .then((result) => {
            callback(result.data)
            console.log(result);

        }).catch((err) => {
            callback(err);
            console.log(err);
        });
}


export const socialPlatforms = [
    { key: 'facebook', label: 'facebook' },
    { key: 'twitter', label: 'twitter' },
    { key: 'instagram', label: 'instagram' },
    { key: 'tiktok', label: 'tikTok' },
];

