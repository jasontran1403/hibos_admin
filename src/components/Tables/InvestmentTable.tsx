import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { URL } from '../../types/constant';

type Investment = {
  code: string;
  walletAddress: string;
  displayName: string;
  packageName: string;
  packagePrice: number;
  date: string;
  status: number;
};

interface InvestmentTableProps {
  data: Investment[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

const InvestmentTable: React.FC<InvestmentTableProps> = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  search,
  onSearchChange,
  onRefresh
}) => {
  const [inputValue, setInputValue] = useState(search);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Debounce: sau 1.5s mới gọi onSearchChange
  useEffect(() => {
    const delay = setTimeout(() => {
      if (inputValue !== search) {
        onSearchChange(inputValue);
      }
    }, 1500);

    return () => clearTimeout(delay); // cleanup khi inputValue thay đổi
  }, [inputValue]);

  const shortenCode = (code: any) => {
    if (code.length <= 16) return code;
    return `Code: ${code.slice(0, 4)}...${code.slice(-4)}`;
  };

  const formatDateTime = (isoStr: any) => {
    const date = new Date(isoStr);
    const time = date.toLocaleTimeString('vi-VN', { hour12: false }); // 11:05:02
    const day = date.toLocaleDateString('vi-VN');                     // 26/05/2025
    return { time, day: day.replace(/\//g, '-') };                    // 26-05-2025
  };


  function formatNumber(value: any) {
    const number = Number(value);

    if (isNaN(number)) return '0';

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  }

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const toggleStatus = (code: string) => {

    let config = {
      method: 'get',
      url: `${URL}admin/toggle-status-gathering/${code}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      }
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === "Toggle gathering status successful.") {
          toast.success(response.data, {
            position: 'top-right',
            autoClose: 1200,
            onClose: () => {
              onRefresh(); // ✅ chỉ chạy sau khi toast đóng
            },
          });
        } else {
          toast.error(response.data, {
            position: 'top-right',
            autoClose: 1500,
          });
        }
      })
      .catch((error) => {
        toast.error(error.message, {
          position: 'top-right',
          autoClose: 1500,
        });
      });

  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <input
        type="text"
        placeholder="Search by code or user name"
        value={inputValue}
        onChange={handleChange}
        className="mb-4 w-full p-2 border rounded"
      />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
              <th className="min-w-[120px] text-left py-4 px-2 font-medium text-black dark:text-white xl:pl-11">Info</th>
              <th className="min-w-[120px] text-right py-4 px-2 font-medium text-black dark:text-white">Gathering</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, key) => (
              <tr key={key}>
                <td className="border-b py-3 px-2 cursor-pointer" onClick={() => copyToClipboard(item.code)}><p>{shortenCode(item.code)}</p>
                  <p>{formatDateTime(item.date).time}
                    <div className="text-gray-500">{formatDateTime(item.date).day}</div></p>
                </td>

                <td className="border-b text-right py-3 px-2"><p>{item.displayName || item.walletAddress}</p><p>{formatNumber(item.packagePrice)} USDT</p>
                  <span onClick={() => toggleStatus(item.code)} className={`cursor-pointer inline-block px-3 py-1 rounded-full text-sm font-medium ${item.status === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status === 0 ? 'Running' : 'Completed'}
                  </span></td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="mt-4 flex justify-center flex-wrap gap-2">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: 3 }, (_, i) => {
          const start = Math.max(0, Math.min(currentPage - 1, totalPages - 3));
          const pageNum = start + i;
          if (pageNum >= totalPages) return null;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 rounded ${pageNum === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
            >
              {pageNum + 1}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default InvestmentTable;
