import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TransactionWithdraw from '../components/Tables/TransactionWithdraw';
import { URL } from '../types/constant';
import Loader from '../common/Loader';

const WithdrawTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listWithdraw, setListWithdraw] = useState([]);
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
      url: `${URL}admin/withdraw`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setLoading(false);

        setListWithdraw(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [accessToken]);

  console.log(accessToken);

  return (
    <>
      <Breadcrumb pageName="Withdraw transactions" />

      <div className="flex flex-col gap-10">
        {loading ? <Loader /> : <TransactionWithdraw data={listWithdraw} />}
      </div>
    </>
  );
};

export default WithdrawTable;
