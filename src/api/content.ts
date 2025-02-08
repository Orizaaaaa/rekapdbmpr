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