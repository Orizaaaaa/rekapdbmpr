import { axiosInterceptor } from "./axiosInterceptor"

export const deleteAcount = async (id: string, callback: any) => {
    await axiosInterceptor.delete(`/account/${id}`)
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            console.log(err);
        });
}

export const updateAccount = async (id: string, form: any, callback: any) => {
    await axiosInterceptor.put(`/account/${id}`, form)
        .then((result) => {
            callback(true, result.data)
        }).catch((err) => {
            callback(false, err);
        });
}

export const createAccount = async (form: any, callback: any) => {
    await axiosInterceptor.post(`/account`, form)
        .then((result) => {
            callback(true, result.data)
        }).catch((err) => {
            callback(false, err);
        });
}