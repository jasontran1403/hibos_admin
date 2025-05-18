import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TransactionTransfer from '../components/Tables/TransactionTransfer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { URL } from '../types/constant';
import Loader from '../common/Loader';

const TransferTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [adminWallet, setAdminWallet] = useState('');
  const [listTransfer, setListTransfer] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [displayName, setDisplayName] = useState('Display name of receiver');
  const [formData, setFormData] = useState({
    walletAddress: '',
    amount: 0,
    type: '2', // Default to USDTBEP20
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const wallet = localStorage.getItem('wallet_address');
    if (token === null || token === '' || wallet === null || wallet === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token);
      setAdminWallet(wallet);
    }
  }, []);

  const logout = () => {
    let config = {
      method: 'get',
      url: `${URL}auth/logout/${accessToken}`, // Adjusted URL
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then(() => {
        localStorage.removeItem('access_token'); // Clear access token
        window.location.href = '/auth/signin'; // Redirect to signin on success
      })
      .catch(() => {
        localStorage.removeItem('access_token'); // Clear access token on error as well
        window.location.href = '/auth/signin'; // Redirect to signin on error
      });
  };

  useEffect(() => {
    setLoading(true);
    let config = {
      method: 'get',
      url: `${URL}admin/transfer`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setListTransfer(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [accessToken]);

  const handleInputChange = (e: any) => {
    if (buttonDisabled) return;
    const { name, value } = e.target;

    if (name === 'amount') {
      const numericValue = Number(value);
      if (isNaN(numericValue) || numericValue < 0) {
        setFormData((prevData) => ({
          ...prevData,
          amount: '',
        }));
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGetDisplayName = () => {
    const { walletAddress } = formData;

    if (walletAddress == '' || !walletAddress) return;
    let config = {
      method: 'get',
      url: `${URL}auth/get-display-name/${formData.walletAddress}`, // Adjusted URL
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        if (response.data.length > 0) {
          setDisplayName(response.data);
        } else {
          setDisplayName('No display name was set yet');
        }
        toast.success("Display name field was updated", {
          position: 'top-right',
          autoClose: 1000,
        });
      })
      .catch(() => {
        toast.error('An error occurred. Please try again.', {
          position: 'top-right',
          autoClose: 1000,
        });
      });
  };

  const handleTransfer = () => {
    const { walletAddress, amount, type } = formData;
    console.log(type);
    if (!walletAddress || amount <= 0 || !type) {
      alert(
        'Please fill in all fields and ensure amount is greater than zero.',
      );
      return;
    }

    // Show SweetAlert2 confirmation modal
    Swal.fire({
      title: 'Confirm Transfer',
      text: `Are you sure you want to transfer ${amount} to ${walletAddress}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, transfer it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'custom-confirm-button', // Custom class for confirm button
        cancelButton: 'custom-cancel-button', // Custom class for cancel button
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Disable the transfer button
        setButtonDisabled(true);

        let data = JSON.stringify({
          from: adminWallet,
          toWalletAddress: formData.walletAddress,
          amount: formData.amount,
          type: formData.type,
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${URL}admin/admin-transfer`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': '69420',
          },
          data: data,
        };

        Axios.request(config)
          .then((response) => {
            setButtonDisabled(true);
            if (response.data === 'Transfer success') {
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
              setButtonDisabled(false);
              toast.error(response.data, {
                position: 'top-right',
                autoClose: 3000,
              });
              // Re-enable the button if the transfer fails
            }
          })
          .catch((error) => {
            // console.log(error);
            toast.error('An error occurred. Please try again.', {
              position: 'top-right',
              autoClose: 3000,
            });
            // Re-enable the button if there is an error
            setButtonDisabled(false);
          });
      }
    });
  };

  return (
    <>
      <Breadcrumb pageName="Transfer transactions" />
      <div className="p-7">
        <div className="mb-5.5 flex flex-col sm:flex-row gap-5.5">
          <div className="w-full sm:w-1/3">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="walletAddress"
            >
              To Wallet Address
            </label>
            <div className="relative">
              <input
                className="w-[75%] rounded border border-stroke bg-gray ml-3 py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="walletAddress"
                id="walletAddress"
                value={formData.walletAddress}
                onChange={handleInputChange}
                placeholder="Transfer to wallet address"
              />
              <span
                className="absolute right-4 top-4"
                onClick={handleGetDisplayName}
                style={{ cursor: 'pointer' }}
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                    fill=""
                  />
                  <path
                    d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="w-full sm:w-1/3">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="walletAddress"
            >
              Display name of receiver
            </label>
            <div className="relative">
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="walletAddress"
                id="walletAddress"
                value={displayName}
                readOnly
              />
            </div>
          </div>

          <div className="w-full sm:w-1/3">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="type"
            >
              Type
            </label>
            <select
              name="type"
              id="type"
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              value={formData.type}
              onChange={(e) => handleInputChange(e)} // Pass the event object
            >
              <option value="2">USDT</option>
              <option value="1" disabled>
                KASPOOL
              </option>
            </select>
          </div>

          <div className="w-full sm:w-1/6 flex items-end mb-2">
            <button
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
              onClick={handleTransfer}
            >
              Transfer
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {loading ? <Loader /> : <TransactionTransfer data={listTransfer} />}
      </div>
    </>
  );
};

export default TransferTable;
