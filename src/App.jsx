import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import UserSelection from './Pages/Auth/UserSelection'
import Signup from './Pages/Auth/Signup'
import Login from './Pages/Auth/Login'
import Dashbord from './Pages/Dashbord'
import Chat from './Pages/Chats/Chat'
import Settings from './Pages/Settings'
import CatogorySelect from './Pages/CatogorySelect'
import Chatpanel from './Pages/Chats/Chatpanel'
import Admindashbord from './Pages/Admindashbord'
import Profile from './Pages/Settings/Profile'
import FeedBackuser from './Pages/Settings/FeedBackuser'
import Help from './Pages/Settings/Help'
import SecurityPrivacy from './Pages/Settings/SecurityPrivacy'
import Advertice from './Pages/Admin pages/Advertice'
import AddCategory from './Pages/Admin pages/AddCatogory'
import BlockedList from './Pages/Admin pages/BlockedList'
import UsersList from './Pages/Admin pages/UsersList'
import WorkersList from './Pages/Admin pages/WorkersList'
import FeedBacks from './Pages/Admin pages/FeedBacks'
import PaymentHistory from './Pages/Admin pages/PaymentHistory'
import Pnf from './Pages/Pnf'
import Payment from './Pages/Payment'
import { ToastContainer, Bounce } from 'react-toastify';
import { LoginUserContext } from './Context/OtherPurpuseContextApi'

function App() {
  const [role, setRole] = useState(null)
  const {loginUserResponse}=useContext(LoginUserContext)

  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      setRole(user.roll.toLowerCase()) // admin or user
    }
  }, [loginUserResponse])

  return (
    <div className='bg-white'>
      <Routes>
        <Route path='*' element={<Pnf />} />
        <Route path='/' element={<Dashbord />} />
        <Route path='/login' element={<Login />} />
        <Route path='/userSelection' element={<UserSelection />} />
        <Route path='/workersignup' element={<Signup isworker={true} />} />
        <Route path='/usersignup' element={<Signup />} />

        {/* Admin Routes */}
        {role === 'admin' && (
          <Route path='/admindashbord' element={<Admindashbord />}>
            <Route path='addcatogory' element={<AddCategory />} />
            <Route path='add_adds' element={<Advertice />} />
            <Route path='blocklist' element={<BlockedList />} />
            <Route path='feedbacklist' element={<FeedBacks />} />
            <Route path='userlist' element={<UsersList />} />
            <Route path='workerlist' element={<WorkersList />} />
            <Route path='paymenthistory' element={<PaymentHistory />} />
          </Route>
        )}

        {/* User Routes */}
        {(role === 'worker' || role === 'user') && (
          <>
            <Route path='/chats' element={<Chat />} />
            <Route path='/chatpanel' element={<Chatpanel />} />
            <Route path='/catogoryselect' element={<CatogorySelect />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/settings' element={<Settings />}>
              <Route path='profile' element={<Profile />} />
              <Route path='feedbackuser' element={<FeedBackuser />} />
              <Route path='help' element={<Help />} />
              <Route path='security&password' element={<SecurityPrivacy />} />
            </Route>
          </>
        )}
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  )
}

export default App
