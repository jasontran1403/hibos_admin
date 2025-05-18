import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const FaSettings = () => {
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState({});
  const [secretPhrase, setSecretPhrase] = useState('');
  const [qrImg, setQrImg] = useState('');
  const [authenCode, setAuthenCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const [accessToken, setAccessToken] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

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

  useEffect(() => {
    let config = {
      method: 'get',
      url: `${URL}admin/showQR/${walletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config).then((response) => {
      setIsEnabled(response.data[0]);
      setSecretPhrase(response.data[1]);
      setQrImg(response.data[2]);
    });
  }, [accessToken, walletAddress]);

  const handleUpdate = () => {
    let data = JSON.stringify({
      walletAddress: walletAddress,
      code: authenCode,
    });

    let config = {
      method: 'post',
      url: `${URL}admin/authentication/enabled`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
      data: data,
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === 'Enabled Success') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Enable 2FA success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        } else {
          toast.error('Enable 2FA failed, wrong 2FA code', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisable = () => {
    let data = JSON.stringify({
      walletAddress: walletAddress,
      code: authenCode,
    });

    let config = {
      method: 'post',
      url: `${URL}admin/authentication/disabled`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
      data: data,
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === 'Disabled Success') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Enable 2FA success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        } else {
          toast.error('Disable 2FA failed, wrong 2FA code', {
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
        <Breadcrumb pageName="Settings" />

        {isEnabled === "true" ? <div className="grid grid-cols-5 gap-8">
          <div className="col-span-12 xl:col-span-12">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  2FA Installation
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
                        2FA code (6-digits)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="walletAddress"
                          id="walletAddress"
                          value={authenCode}
                          onChange={(e) => {
                            setAuthenCode(e.target.value);
                          }} // Handle change
                        />
                      </div>
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
                      onClick={handleDisable}
                    >
                      Disable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> :
        
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-12 xl:col-span-12">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  2FA Installation
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
                        QR Code
                      </label>
                      <div className="relative">
                        <img src={qrImg} />
                      </div>
                    </div>

                    <div className="w-full sm:w-full">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="walletAddress"
                      >
                        Secret phrase
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="walletAddress"
                          id="walletAddress"
                          value={secretPhrase}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-full">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="walletAddress"
                      >
                        2FA code (6-digits)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="walletAddress"
                          id="walletAddress"
                          value={authenCode}
                          onChange={(e) => {
                            setAuthenCode(e.target.value);
                          }} // Handle change
                        />
                      </div>
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
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      </div>
      <ToastContainer />
    </>
  );
};

export default FaSettings;
