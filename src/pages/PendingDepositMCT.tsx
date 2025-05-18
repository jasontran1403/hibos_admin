import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PendingDepositTable from '../components/Tables/PendingDepositTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Loader from '../common/Loader';

const PendingDepositMCT = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [accessToken, setAccessToken] = useState('');
  const [listUnCollect, setListUnCollect] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token === null || token === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token); // Here, token is guaranteed to be a string.
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
        window.location.href = '/auth/signin';   // Redirect to signin on success
      })
      .catch(() => {
        localStorage.removeItem('access_token'); // Clear access token on error as well
        window.location.href = '/auth/signin';   // Redirect to signin on error
      });
  };

  useEffect(() => {
    setLoading(true);
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${URL}admin/pending-deposit-mct-collect`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setListUnCollect(response.data);
      })
      .catch((error) => {
      });
    setLoading(false);
  }, [accessToken]);

  const handleCollectAll = () => {};

  const handleCollectWallet = (walletAddress: string) => {
    if (buttonDisabled) return;
    if (walletAddress === null || walletAddress === '') {
      return;
    }

    Swal.fire({
      title: 'Confirm collect wallet',
      text: `Are you sure you want to collect`,
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
        setButtonDisabled(true);
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${URL}admin/pending-deposit-mct/${walletAddress}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': '69420',
          },
        };

        Axios.request(config)
          .then((response) => {
            if (response.data === 'ok') {
              setButtonDisabled(true);

              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Collect amount success',
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
            }
          })
          .catch((error) => {
            setButtonDisabled(false);

            toast.error('Failed when collect', {
              position: 'top-right',
              autoClose: 3000,
            });
          });
      }
    });
  };

  return (
    <>
      <Breadcrumb pageName="Pending Deposit" />
      <div className="p-4 md:p-6 xl:p-9">
        <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-20">
          <Link
            to="#"
            onClick={handleCollectAll}
            className="inline-flex items-center justify-center rounded-md border border-primary py-4 px-10 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Collect all
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        {loading ? (
          <Loader />
        ) : (
          <PendingDepositTable
            data={listUnCollect}
            handleCollect={handleCollectWallet}
          />
        )}
      </div>
    </>
  );
};

export default PendingDepositMCT;
