import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';


const Settings = () => {
  const [accessToken, setAccessToken] = useState('');
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token === null || token === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token);
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
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${URL}admin/user/${id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setUserDetail(response.data);
      })
      .catch((error) => {
        if (error.status === 404) {
          window.location.href = '/users';
        }
      });
  }, [id, accessToken]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    let newValue = value;

    // Cap values based on maximum limits
    if (name === 'userRank') {
      newValue = Math.min(Number(value), 10); // Max 8
    } else if (name === 'directRank') {
      newValue = Math.min(Number(value), 5); // Max 6
    } else if (name === 'binaryRank') {
      newValue = Math.min(Number(value), 5); // Max 4
    }

    setUserDetail((prevDetail) => ({
      ...prevDetail,
      [name]: newValue,
    }));
  };

  const handleUpdate = () => {
    let data = JSON.stringify({
      walletAddress: userDetail.walletAddress,
      displayName: userDetail.displayName,
      userRank: userDetail.userRank,
      directRank: userDetail.directRank,
      binaryRank: userDetail.binaryRank,
      rootId: userDetail.rootId,
      sales: userDetail.sales,
      adminSet: userDetail.isAdminSet,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${URL}admin/user`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
      data: data,
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === 'Update user detail success') {
          // toast.success(response.data, {
          //   position: 'top-right',
          //   autoClose: 3000,
          //   onClick: () => window.location.reload(),
          // });
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Update user detail success',
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
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-12 xl:col-span-12">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="walletAddress"
                      >
                        Wallet Address
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="walletAddress"
                          id="walletAddress"
                          value={userDetail.walletAddress}
                          onChange={handleInputChange} // Handle change
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="displayName"
                      >
                        Display Name
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="displayName"
                        id="displayName"
                        value={userDetail.displayName || ''}
                        onChange={handleInputChange} // Handle change
                      />
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="userRank"
                      >
                        User rank
                      </label>
                      <div className="relative">
                        <select
                          name="userRank"
                          id="userRank"
                          value={userDetail.userRank} // Controlled input for userRank
                          onChange={handleInputChange} // Handles changes in input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        >
                          {/* Generate options from -1 to 8 */}
                          {[...Array(9)].map((_, index) => {
                            const value = index; // -1 to 8
                            return (
                              <option key={value} value={value}>
                                Rank {value}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="rootId"
                      >
                        Root Id
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="rootId"
                        id="rootId"
                        value={userDetail.rootId}
                        // onChange={handleInputChange} // Handle change
                        readOnly
                      />
                    </div>
                  </div>


                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="sales"
                      >
                        Person Sales
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="sales"
                          id="sales"
                          value={userDetail.sales || 0}
                          min="0"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="sales"
                      >
                        Total Sales
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="sales"
                          id="sales"
                          value={userDetail.totalSalesBranch || 0}
                          min="0"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* <div className="w-full sm:w-1/2">
                      <label
                        htmlFor="toggle4"
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        <div className="pr-4">
                          <p>Rank set</p>
                        </div>

                        <div className="relative mt-5">
                          <input
                            type="checkbox"
                            id="toggle4"
                            className="sr-only"
                            checked={true} // Use userDetail.isAdminSet or default to true
                            onChange={() => {
                              setUserDetail((prevDetail) => ({
                                ...prevDetail,
                                isAdminSet: !prevDetail.isAdminSet, // Toggle the state
                              }));
                            }}
                          />
                          <div
                            className={`block h-8 w-14 rounded-full transition-all ${
                              userDetail.isAdminSet ? 'bg-success' : 'bg-gray'
                            }`}
                          ></div>
                          <div
                            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform duration-300 ${
                              userDetail.isAdminSet
                                ? 'translate-x-full right-1'
                                : ''
                            }`}
                          ></div>
                        </div>
                      </label>
                    </div> */}
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="sales"
                      >
                        Total Deposit USDT
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="sales"
                          id="sales"
                          value={userDetail.totalDepositUSDT || 0}
                          min="0"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="sales"
                      >
                        Total Withdraw USDT
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="sales"
                          id="sales"
                          value={userDetail.totalWithdrawUSDT || 0}
                          min="0"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="sales"
                      >
                        Total BBA Deposit
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="sales"
                          id="sales"
                          value={userDetail.totalDepositBBA || 0}
                          min="0"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="sales"
                      >
                        Total BBA Withdraw
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="sales"
                          id="sales"
                          value={userDetail.totalWithdrawBBA || 0}
                          min="0"
                          readOnly
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

export default Settings;
