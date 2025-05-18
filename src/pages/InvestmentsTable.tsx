import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvestmentTable from '../components/Tables/InvestmentTable';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Loader from '../common/Loader'; // Importing Loader component

const InvestmentsTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listInvestment, setListInvestment] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch access token from local storage
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

  // Fetch investments list
  useEffect(() => {
    setLoading(true); // Start loading
    let config = {
      method: 'get',
      url: `${URL}admin/investments`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setListInvestment(response.data); // Set fetched data
        setLoading(false); // Stop loading when data is received
      })
      .catch((error) => {
        setLoading(false); // Stop loading on error
        console.log(error);
      });
  }, [accessToken]);

  // Handle pay daily reward action
  const handlePayDaily = () => {
    let config = {
      method: 'get',
      url: `${URL}auth/pay-daily`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === 'ok') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Daily reward pay success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error('Failed to process daily reward', {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  return (
    <>
      <Breadcrumb pageName="Investments table" />
      <button className="btn btn-succecss" onClick={handlePayDaily}>Pay daily</button>
      <div className="flex flex-col gap-10">
        {/* Show Loader while loading is true, otherwise show InvestmentTable */}
        {loading ? (
          <Loader /> // Loader is displayed during data fetching
        ) : (
          <InvestmentTable data={listInvestment} />
        )}
      </div>
    </>
  );
};

export default InvestmentsTable;
