import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

type User = {
  walletAddress: string;
  displayName: string | null; // Adjusted to allow null
  rootId: string;
  sales: number;
  teamsales: number;
  leftRef: string;
  rightRef: string;
  rank: number;
  binaryRank: number;
  directRank: number;
  leaderRank: number;
  maxOut: number;
  lock: boolean;
  lockTransaction: boolean;
  lockWithdraw: boolean;
};

interface UserTableProps {
  data: User[];
  currentPage?: number,
  totalPage?: number,
  searchTerm: string; // Nhận searchTerm từ props
  onSearchChange: (term: string) => void; // Nhận hàm để thay đổi searchTerm
  onPageChange: (newPage: number) => void; // Function to handle page change
}

const UserTable: React.FC<UserTableProps> = ({ data, currentPage = 0, totalPage = 0, onPageChange, searchTerm, onSearchChange }) => {
  const [accessToken] = useState(localStorage.getItem('access_token'));

  const [page, setPage] = useState(currentPage);

  const handlePrev = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handleUserPage = (userWallet: string) => {
    if (userWallet === null || userWallet === '') {
      return;
    }

    window.location.href = `/user/${userWallet}`;
  };

  const pageNumbers = Array.from({ length: Math.min(5, totalPage) }, (_, index) => {
    const startPage = Math.max(0, currentPage - 2); // Start at currentPage - 2
    return startPage + index; // Generate page numbers based on the starting point
  }).filter(page => page < totalPage); // Ensure no out-of-bound pages


  const handleToggle = (userWalletAddress: string) => {
    if (userWalletAddress === null || userWalletAddress === '') {
      return;
    }

    let config = {
      method: 'get',
      url: `${URL}admin/toggle-status/${userWalletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${response.data}`,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleToggleTransaction = (userWalletAddress: string) => {
    if (userWalletAddress === null || userWalletAddress === '') {
      return;
    }

    let config = {
      method: 'get',
      url: `${URL}admin/lock-transaction/${userWalletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Toggle transfer status success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  const handleToggleWithdraw = (userWalletAddress: string) => {
    if (userWalletAddress === null || userWalletAddress === '') {
      return;
    }

    let config = {
      method: 'get',
      url: `${URL}admin/lock-withdraw/${userWalletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Toggle withdraw status success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  const handleToggleStaking = (walletAddress: string) => {
    let config = {
      method: 'get',
      url: `${URL}admin/end-stake/${walletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios
      .request(config)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'End staking success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const copyToClipboard = (wallet: string) => {
    navigator.clipboard
      .writeText(wallet)
      .then(() => {
        toast.success('Wallet address copied to clipboard', {
          position: 'top-right',
          autoClose: 1500,
        });
      })
      .catch((err) => {
        toast.error(err, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <input
        type="text"
        placeholder="Search by Wallet Address or Display Name"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Wallet Address
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Display Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Sales
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Rank
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              {/* 
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Transfer
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Withdraw
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Staking
              </th> */}
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr key={idx}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className="text-black dark:text-white"
                    onClick={() => {
                      copyToClipboard(user.walletAddress);
                    }}
                  >
                    {truncateAddress(user.walletAddress)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.displayName || 'N/A'} {/* Handle null displayName */}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.sales}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.rank}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p onClick={() => {
                    handleToggle(user.walletAddress);
                  }} className={`cursor-pointer font-semibold ${user.lock ? 'text-red-500' : 'text-green-500'}`}>
                    {user.lock ? 'Locked' : 'Not Locked'}
                  </p>
                </td>


                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <a
                      className="hover:text-primary"
                      href={`https://www.bitboss.info/admin/home/${user.walletAddress}`}
                      target="_blank"
                    >
                      {/* Login Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 8.5V10h-4v4h4v1.5c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-1.5H4v-4h2V8.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5zM21 12c0 4.41-3.59 8-8 8s-8-3.59-8-8h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2z"
                          fill=""
                        />
                      </svg>
                    </a>

                    {/* Eye Icon */}
                    <button
                      className="hover:text-primary"
                      onClick={() => handleUserPage(user.walletAddress)}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 6C8.13 6 5.36 9 3.34 12c2.02 3 4.76 6 8.66 6 4.87 0 7.62-3 9.66-6C19.62 9 16.87 6 12 6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          className={`mx-1 px-3 py-1 rounded ${currentPage === 0 ? 'bg-gray-300' : 'bg-gray-300 text-black'}`}
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          Prev
        </button>

        {pageNumbers.map(pageIndex => (
          <button
            key={pageIndex}
            className={`mx-1 px-3 py-1 rounded ${currentPage === pageIndex ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => onPageChange(pageIndex)}
          >
            {pageIndex + 1}
          </button>
        ))}

        <button
          className={`mx-1 px-3 py-1 rounded ${currentPage === totalPage - 1 ? 'bg-gray-300' : 'bg-gray-300 text-black'}`}
          onClick={handleNext}
          disabled={currentPage === totalPage - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
