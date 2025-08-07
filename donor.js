let donorsData = [];
let currentPage = 1;
const rowsPerPage = 4;

async function fetchDonors() {
    const url = "https://opensheet.elk.sh/1uSXrufCixUEbfbF0iyEZPQ6D8kq_g3CN8cPaOACc-TI/Trang%20t%C3%ADnh1";
    const res = await fetch(url);
    const data = await res.json();
    //donorsData = data.filter(row => row["Họ tên"] && row["Số tiền"]);
    // Lọc bỏ dòng tiêu đề
    donorsData = data
    currentPage = 1;
    renderDonors();
    renderPagination();
}

function renderDonors() {
    const tbody = document.getElementById('donor-list');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = donorsData.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center text-gray-400">Không có dữ liệu.</td></tr>`;
        return;
    }

    pageData.forEach(row => {
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="py-3 px-4 font-semibold">${row["Họ tên"] ? row["Họ tên"] : ""}</td>
                <td class="py-3 px-4 text-green-600 font-bold">${
                    typeof row["Số tiền"] === 'number'
                        ? row["Số tiền"].toLocaleString('vi-VN') + "đ"
                        : (typeof row["Số tiền"] === 'string' && !isNaN(Number(row["Số tiền"]))
                            ? Number(row["Số tiền"]).toLocaleString('vi-VN') + "đ"
                            : (row["Số tiền"] || "")
                    )}
                </td>
                <td class="py-3 px-4 italic text-gray-500">${row["Lời Nhắn"] || ""}</td>
            </tr>
        `;
    });
}

function renderPagination() {
    const totalPages = Math.ceil(donorsData.length / rowsPerPage);
    const paginationDiv = document.getElementById('donor-pagination');
    if (!paginationDiv) return;

    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }

    let html = `<button onclick="changePage(currentPage-1)" ${currentPage === 1 ? 'disabled' : ''} class="px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}">Trước</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="changePage(${i})" class="px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-orange-500 text-white font-bold' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}">${i}</button>`;
    }
    html += `<button onclick="changePage(currentPage+1)" ${currentPage === totalPages ? 'disabled' : ''} class="px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}">Sau</button>`;
    paginationDiv.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(donorsData.length / rowsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderDonors();
    renderPagination();
}

// Tải dữ liệu lần đầu
document.addEventListener('DOMContentLoaded', fetchDonors); 