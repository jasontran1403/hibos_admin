import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const Profile = () => {
  const [accessToken, setAccessToken] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const { id } = useParams();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const walletAddress = localStorage.getItem('wallet_address');

    if (
      token === null ||
      token === '' ||
      walletAddress === null ||
      walletAddress === ''
    ) {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token);
      setWalletAddress(walletAddress);
    }
  }, []);

  const handleUpdate = () => {
    if (
      currentPassword === '' ||
      newPassword === '' ||
      confirmationPassword === ''
    ) {
      toast.error('Input field must not be empty', {
        position: 'top-right',
        autoClose: 2000,
      });
      return;
    }

    let data = JSON.stringify({
      walletAddress: walletAddress,
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmationPassword: confirmationPassword,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${URL}admin/change-password`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
      data: data,
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === 'ok') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Change password success',
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Account password" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-12 xl:col-span-12">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Password change
                </h3>
              </div>
              <div className="p-7">
                <div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-full">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="walletAddress"
                      >
                        Current password
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="walletAddress"
                          id="walletAddress"
                          value={currentPassword}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value);
                          }} // Handle change
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="userRank"
                      >
                        New password
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="userRank"
                          id="userRank"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                          }} // Handle change
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="directRank"
                      >
                        Confirm new password
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="directRank"
                        id="directRank"
                        value={confirmationPassword}
                        onChange={(e) => {
                          setConfirmationPassword(e.target.value);
                        }} // Handle change
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Profile;
