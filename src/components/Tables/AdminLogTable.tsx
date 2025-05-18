import React from 'react';

type Investment = {
  id: number;
  username: string;
  method: string;
  message: string;
  result: string;
  time: string;
  ip: string;
  deviceName: string;
};

interface InvestmentTableProps {
  data: Investment[];
}

const AdminLogTable: React.FC<InvestmentTableProps> = ({ data }) => {

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Username</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Method</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Message</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Result</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">IP</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Device</th>

            </tr>
          </thead>
          <tbody>
            {data.map((packageItem, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.username}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.method}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.message}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.result}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.ip}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.deviceName}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLogTable;
