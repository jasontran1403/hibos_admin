import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Loader from '../common/Loader';
import { saveAs } from 'file-saver';

const AdminInfo = () => {
  const [accessToken, setAccessToken] = useState('');
  const [bscPrivateKey, setBscPrivateKey] = useState('');
  const [price, setPrice] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [bbaBalance, setBbaBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [adminWallet, setAdminWallet] = useState("");
  const [rate1, setRate1] = useState(0);
  const [rate2, setRate2] = useState(0);
  const [rate3, setRate3] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const adminWalletStorage = localStorage.getItem('wallet_address');

    if (token === null || token === '' || adminWalletStorage === null || adminWalletStorage === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token); // Here, token is guaranteed to be a string.
      setAdminWallet(adminWalletStorage);
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
    if (accessToken === '') {
      return;
    }

    setLoading(true);
    let config = {
      method: 'get',
      url: `${URL}admin/admin-tool/${adminWallet}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setBscPrivateKey(response.data.privateKey);
        setPrice(response.data.price);
        setBnbBalance(response.data.bnbBalance);
        setUsdtBalance(response.data.usdtBalance);
        setWalletAddress(response.data.walletAddress);
        setBbaBalance(response.data.bbaBalance);
        setRate1(response.data.rate1);
        setRate2(response.data.rate2);
        setRate3(response.data.rate3);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  }, [accessToken]);

  const handleUpdate = () => {
    if (isNaN(price) || price <= 0 || isNaN(rate1) || rate1 <= 0 || isNaN(rate2) || rate2 <= 0 || isNaN(rate3) || rate3 <= 0) {
      return;
    }

    let data = JSON.stringify({
      userWalletAddress: adminWallet,
      privateKey: bscPrivateKey,
      walletAddress: walletAddress,
      price: price,
      rate1: rate1,
      rate2: rate2,
      rate3: rate3
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${URL}admin/update-admin-tool`,
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
            title: 'Update info success',
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
      });
  };

  const handleExportDeposit = () => {
    let config = {
      method: 'get',
      url: `${URL}admin/export-deposit`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
      responseType: 'blob', // Quan trọng để nhận dữ liệu dưới dạng file
    };

    Axios.request(config)
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'deposit_history.xlsx'); // Đặt tên file tải về
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  const handleExportDirect = () => {
    let config = {
      method: 'get',
      url: `${URL}admin/export-direct`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
      responseType: 'blob', // Quan trọng để nhận dữ liệu dưới dạng file
    };

    Axios.request(config)
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'direct_history.xlsx'); // Đặt tên file tải về
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  const handleExportWithdraw = () => {
    let config = {
      method: 'get',
      url: `${URL}admin/export-withdraw`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
      responseType: 'blob', // Quan trọng để nhận dữ liệu dưới dạng file
    };

    Axios.request(config)
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'withdraw_history.xlsx');
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-12 xl:col-span-12">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="p-7">
                  <div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          Wallet Address
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={walletAddress}
                          onChange={(e) => {
                            setWalletAddress(e.target.value);
                          }}
                        />
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Private Key
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={bscPrivateKey}
                            onChange={(e) => {
                              setBscPrivateKey(e.target.value);
                            }}
                          />
                        </div>
                      </div>


                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/3">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          BNB Balance
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={bnbBalance}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/3">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          USDT Balance
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={usdtBalance}
                          readOnly
                        />
                      </div>

                      <div className="w-full sm:w-1/3">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          BBA Balance
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={bbaBalance}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Bitboss AI Price
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={price}
                            onChange={(e) => {
                              setPrice(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/3">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Rate1
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={rate1}
                            onChange={(e) => {
                              setRate1(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/3">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Rate2
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={rate2}
                            onChange={(e) => {
                              setRate2(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/3">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Rate3
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={rate3}
                            onChange={(e) => {
                              setRate3(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4.5">
                      <button className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              {/* <div className="w-full flex justify-center items-center gap-6 mt-3">
                <button className="flex justify-center rounded bg-primary py-2 px-3 font-medium text-gray hover:bg-opacity-70"
                  onClick={handleExportDeposit}
                >
                  Export Deposit
                </button>
                <button className="flex justify-center rounded bg-primary py-2 px-3 font-medium text-gray hover:bg-opacity-70"
                  onClick={handleExportDirect}
                >
                  Export Direct
                </button>
                <button
                  onClick={handleExportWithdraw}
                  className="flex justify-center rounded bg-primary py-2 px-3 font-medium text-gray hover:bg-opacity-70"
                >
                  Export Withdraw
                </button>
              </div> */}
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default AdminInfo;
