import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import PendingDeposit from './pages/PendingDeposit';
import PendingWithdraw from './pages/PendingWithdraw';
import UserTable from './pages/UserTable';
import InvestmentsTable from './pages/InvestmentsTable';
import DepositTable from './pages/DepositTable';
import WithdrawTable from './pages/WithdrawTable';
import TransferTable from './pages/TransferTable';
import SwapTable from './pages/SwapTable';
import DirectCommission from './pages/DirectCommission';
import FaSettings from "./pages/FaSettings";
import BinaryCommission from './pages/BinaryCommission';
import LeaderCommission from './pages/LeaderCommission';
import PopCommission from './pages/PopCommission';
import DailyReward from './pages/DailyReward';
import AdminInfo from './pages/AdminInfo';
import PendingDepositMCT from './pages/PendingDepositMCT';
import PendingWithdrawMCT from './pages/PendingWithdrawMCT';
import AdminLog from './pages/AdminLog';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="BitBoss AI Admin Dashboard" />
              <AdminInfo />
            </>
          }
        />
        <Route
          path="/logs"
          element={
            <>
              <PageTitle title="Admin Log | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AdminLog />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        
        <Route
          path="/auth/signin"
          element={
            <>
              <SignIn />
            </>
          }
        />
        
        <Route
          path="/user/:id"
          element={
            <>
              <PageTitle title="User page" />
              <Settings />
            </>
          }
        />
        {/* <Route
          path="/tools"
          element={
            <>
              <PageTitle title="Admin Info" />
              <AdminInfo />
            </>
          }
        /> */}
        
        <Route
          path="/users"
          element={
            <>
              <PageTitle title="List users" />
              <UserTable />
            </>
          }
        />

        <Route
          path="/pending-withdraw"
          element={
            <>
              <PageTitle title="List withdrawals" />
              <PendingWithdraw />
            </>
          }
        />
        
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="2FA Settings" />
              <FaSettings />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
