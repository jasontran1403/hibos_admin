import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { URL } from '../types/constant';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const DepositCheck = () => {
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token);
      setLoading(false); // Đã có token, ngừng loading
    }
  }, []);

  const ConfirmForm: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleConfirm = async () => {
      if (!walletAddress) return;

      setSubmitting(true);
      setMessage('');

      try {
        const data = JSON.stringify({ walletAddress });

        const config = {
          method: 'post',
          url: `${URL}admin/check-deposit`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': '69420',
          },
          data,
        };

        const response = await Axios.request(config);

        if (response.data.includes('[Checked deposit USDT]')) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.data,
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        } else {
          toast.error(response.data, {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } catch (error: any) {
        toast.error(error.message || 'Error occurred', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-boxdark rounded-md shadow-md">
        {/* Spinner Overlay */}
        {submitting && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 rounded-md">
            <svg
              className="animate-spin h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
          Wallet Address / Display Name
        </label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-form-input dark:text-white"
          placeholder="Enter wallet address or display name..."
        />
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-opacity-90 transition disabled:opacity-60"
        >
          Confirm
        </button>

        {message && (
          <div className="mt-4 text-sm text-gray-800 dark:text-white whitespace-pre-line">
            {message}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Breadcrumb pageName="Check Deposit" />
      <div className="flex flex-col gap-10">
        {loading ? <Loader /> : <ConfirmForm />}
      </div>
    </>
  );
};

export default DepositCheck;
