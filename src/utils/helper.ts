export function formatText(text: string, maxLength: number = 34): string {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    }
    return text;
}
export const formatDate = (tanggal: any) => {
    const date = new Date(tanggal);  // Pastikan 'tanggal' adalah objek Date

    // Cek apakah 'date' adalah objek Date yang valid
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }

    const tahun = date.getFullYear();
    const bulan = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0, jadi tambahkan 1
    const hari = String(date.getDate()).padStart(2, '0');

    return `${tahun}-${bulan}-${hari}`;
};

export const handleCopy = (link: string) => {
    const linkToCopy = link;
    navigator.clipboard.writeText(linkToCopy)
        .then(() => {
            alert("Link berhasil disalin ke clipboard!");
        })
        .catch(() => {
            alert("Gagal menyalin link.");
        });
};

export function formatCatrgory(text: string, maxLength: number = 34): string {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    }
    return text;
}

export const changeTypeAccount = (type: number): string => {
    switch (type) {
        case 1:
            return 'Aset';
        case 2:
            return 'Kewajiban';
        case 3:
            return 'Ekuitas';
        case 4:
            return 'Pendapatan';
        case 5:
            return 'Beban';
        default:
            return 'Tipe tidak dikenal'; // Mengembalikan nilai default jika tipe tidak ditemukan
    }
};


export function formatRupiah(amount: number | undefined): string {
    if (amount === undefined) {
        return 'Rp 0';
    }
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


export function capitalizeWords(str: string): string {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}


export const formatDateStr = (dateObj?: { month: number, day: number, year: number }) =>
    dateObj ? `${dateObj.month.toString().padStart(2, '0')}/${dateObj.day.toString().padStart(2, '0')}/${dateObj.year.toString().padStart(4, '0')}` : '';

export const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

export function formatDatePost(isoString: string): string {
    const date = new Date(isoString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() dimulai dari 0
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

// Contoh penggunaan
console.log(formatDate("2025-02-20T00:00:00.000Z")); // Output: 02/20/2025

const dateNow = new Date();
export const dateFirst = getFirstDayOfMonth(dateNow);