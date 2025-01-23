import { url } from "inspector";
import { axiosInterceptor } from "./axiosInterceptor"

export const createTransaction = async (form: any, callback: any) => {
    await axiosInterceptor.post('/journal', form)
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
            console.log(err);

        });

}

export const getJurnalUmum = (startDate: string, endDate: string, callback: any) => {
    axiosInterceptor.get('/journal/list', { params: { startDate: startDate, endDate: endDate } })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });

}

export const updateJurnalUmum = async (id: string, form: any, callback: any) => {
    await axiosInterceptor.put(`journal/${id}`, form)
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });
}

export const deleteJurnal = async (id: string, callback: any) => {
    axiosInterceptor.delete(`journal/${id}`)
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });
}

export const downloadJurnal = (startDate: string, endDate: string, callback: any) => {
    axiosInterceptor.get(`/journal/export`, {
        params: { startDate, endDate },
        responseType: 'blob'  // Mengharapkan response sebagai Blob (file)
    })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });
}
export const downloadBukuBesar = (startDate: string, endDate: string, callback: any) => {
    axiosInterceptor.get(`/balance/export-buku-besar`, {
        params: { startDate, endDate },
        responseType: 'blob'  // Mengharapkan response sebagai Blob (file)
    })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });
}
export const downloadNeraca = (startDate: string, endDate: string, callback: any) => {
    axiosInterceptor.get(`/balance/export-neraca`, {
        params: { startDate, endDate },
        responseType: 'blob'  // Mengharapkan response sebagai Blob (file)
    })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });
}
export const downloadLabaRugi = (startDate: string, endDate: string, callback: any) => {
    axiosInterceptor.get(`/balance/export-pendapatan-beban`, {
        params: { startDate, endDate },
        responseType: 'blob'  // Mengharapkan response sebagai Blob (file)
    })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });
}

export const getBukuBesar = (startDate: string, endDate: string, callback: any) => {
    axiosInterceptor.get('/account/accounts-with-journals', { params: { startDate: startDate, endDate: endDate } })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });

}
export const getNeraca = (startDate: string, endDate: string, callback: any) => {
    axiosInterceptor.get('/balance/total-balance', { params: { startDate: startDate, endDate: endDate } })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });

}
export const GetLabaRugi = (startDate: string, endDate: string, callback: any) => {
    axiosInterceptor.get('/balance/pendapatan-beban', { params: { startDate: startDate, endDate: endDate } })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });

}

export const getDataCart = (callback: any) => {
    axiosInterceptor.get('/balance/finance-data')
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            callback(err);
        });
}

export const deleteAllJournal = async (callback: (result: any) => void) => {
    try {
        const result = await axiosInterceptor.delete('/journal/delete-all-journals');
        callback(result.data);
    } catch (err) {
        callback(err);
        console.log(err);
    }
}
