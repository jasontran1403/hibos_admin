import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PendingWithdrawTable from '../components/Tables/PendingWithdrawTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from "../types/constant";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const PendingWithdraw = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [accessToken, setAccessToken] = useState('');
  const [pendingWithdraw, setPendingWithdraw] = useState([]);

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
    if (accessToken === null || accessToken === '') return;
    
    let config = {
      method: 'get',
      url: `${URL}admin/pending-withdraw`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setPendingWithdraw(response.data);
      })
      .catch((error) => {
      });
  }, [accessToken]);

  const handleApproveAll = () => { };

  const handleApprove = (code: string) => {
    if (buttonDisabled) return;
    if (code === null || code === '') {
      return;
    }

    Swal.fire({
      title: 'Confirm withdraw',
      text: `Are you sure you want to approve`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, transfer it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'custom-confirm-button', // Custom class for confirm button
        cancelButton: 'custom-cancel-button',   // Custom class for cancel button
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setButtonDisabled(true);
        let config = {
          method: 'get',
          url: `${URL}admin/approve-withdraw/${code}`,
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
            setButtonDisabled(false);
            console.log(error);
          });
      }
    });


  };

  return (
    <>
      <Breadcrumb pageName="Pending withdraw" />
      <div className="flex flex-col gap-10">
        <PendingWithdrawTable
          handleApprove={handleApprove}
          data={pendingWithdraw}
        />
      </div>
    </>
  );
};

export default PendingWithdraw;
