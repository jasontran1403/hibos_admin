import React, { useState } from 'react';

type Investment = {
  code: string;
  walletAddress: string;
  displayName: string;
  packageName: string;
  packagePrice: number;
  date: string;
  status: number;
};

interface InvestmentTableProps {
  data: Investment[];
}

const InvestmentTable: React.FC<InvestmentTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data based on search input
  const filteredData = data.filter(item =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <input
        type="text"
        placeholder="Search by code, displayName, or walletAddress"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Code</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Date</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">User</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Package Info</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((packageItem, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.code}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.date}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {packageItem.displayName.length > 0 ? packageItem.displayName : packageItem.walletAddress}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">{packageItem.capital} USDT</h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${packageItem.status === 0 ? 'bg-success text-info' : 'bg-danger text-danger'}`}>
                    {packageItem.status === 0 ? 'Running' : 'Completed'}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1 ? 'bg-gray-300' : 'bg-gray-300 text-black'
          }`}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
          const startPage = Math.max(
            1,
            Math.min(currentPage - 1, totalPages - 2),
          ); // Ensure the range ends at totalPages
          const pageIndex = startPage + index;
          return (
            <button
              key={pageIndex}
              onClick={() => handlePageChange(pageIndex)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === pageIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300'
              }`}
            >
              {pageIndex}
            </button>
          );
        })}
        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300'
              : 'bg-gray-300 text-black'
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InvestmentTable;
