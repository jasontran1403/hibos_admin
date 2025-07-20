import { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import InvestmentTable from '../components/Tables/InvestmentTable';
import Loader from '../common/Loader';
import { URL } from '../types/constant';

const InvestmentsTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listInvestment, setListInvestment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token);
    }
  }, []);

  const fetchData = useCallback(() => {
    if (!accessToken) return;

    setLoading(true);
    Axios.get(`${URL}admin/investments`, {
      params: {
        page,
        size,
        code: search,
        displayName: search,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    })
      .then((res) => {
        setListInvestment(res.data.content);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [accessToken, page, size, search]);

  // Call fetchData on relevant changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col gap-10">
      {loading ? (
        <Loader />
      ) : (
        <InvestmentTable
          data={listInvestment}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          search={search}
          onSearchChange={(s) => {
            setPage(0);
            setSearch(s);
          }}
          onRefresh={fetchData} // ✅ truyền đúng hàm fetchData vào đây
        />
      )}
    </div>
  );
};

export default InvestmentsTable;
