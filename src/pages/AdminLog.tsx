import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { URL } from '../types/constant';
import Loader from '../common/Loader'; // Importing Loader component
import AdminLogTable from '../components/Tables/AdminLogTable';

const AdminLog = () => {
  const [accessToken, setAccessToken] = useState('');
  const [adminLogs, setAdminLogs] = useState([]);
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
      url: `${URL}admin/admin-log`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setAdminLogs(response.data.content); // Set fetched data
        setLoading(false); // Stop loading when data is received
      })
      .catch((error) => {
        setLoading(false); // Stop loading on error
        console.log(error);
      });
  }, [accessToken]);

  return (
    <>
      <Breadcrumb pageName="Admin logs" />
      <div className="flex flex-col gap-10">
        {/* Show Loader while loading is true, otherwise show InvestmentTable */}
        {loading ? (
          <Loader /> // Loader is displayed during data fetching
        ) : (
          <AdminLogTable data={adminLogs} />
        )}
      </div>
    </>
  );
};

export default AdminLog;
