import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import components
import Loading from './Loading/Loading';

// Lazy load components
const Landing = lazy(() => import('./landing/Landing'));
const AdminSignUp = lazy(() => import('./Auth/AdminSignup/AdminSignup'));
const UserSignUp = lazy(() => import('./Auth/UserSignup/userSignup'));
const UserLogin = lazy(() => import('./Auth/UserLogin/UserLogin'));
const BooksPage = lazy(() => import('./book/books'));
const BooksDetails = lazy(() => import('./book/book-details'));
const AdminIndex = lazy(() => import('./admin/admin-main/index'));
const BookInventory = lazy(() => import('./admin/admin-BookInventory/book-inventory'));
const EditBook = lazy(() => import('./admin/Admin-BookUpdate/Bookupdate')); // Ensure this path is correct
const UsersPage = lazy(() => import('./admin/Admin-users-list/users'));
const AddBook = lazy(() => import('./admin/admin-AddBook/AddBook'));
const StockOut = lazy(() => import('./admin/admin-StockOut/stockout'));
const BookRequestInventory = lazy(() => import('./admin/admin-RequestBook/RequestBook'));
const BookReturn = lazy(() => import('./admin/admin-return/return'));
const UserActivities = lazy(() => import('./admin/Admin-Activities/Activities'));
const UserProfile = lazy(() => import('./admin/Admin-UserProfile/Userprofile'));
const Profile = lazy(() => import('./admin/Admin-profile/profile'));
const MailConfigPage = lazy(() => import('./admin/Admin-mails/mails'));
const UserDashboard = lazy(() => import('./user/User-dashboard/UserDashboard'));
const RenewReturn = lazy(() => import('./user/User-Return-Renew/Return-Renew'));
const UserProfile1 = lazy(() => import('./user/user-profile/profile'));
const Footer = lazy(() => import('./partials/Footer/Footer'));

const IfUser = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('/middleware/ifUser')
      .then((res) => {
        if (res.data?.isUser) {
          navigate('/user/dashboard/1');
        } else if (res.data?.isAdmin) {
          navigate('/admin/1/profile');
        }
      })
      .catch((err) => {
        console.error('Error checking user:', err);
      });
  }, [navigate]);
}

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    axios.get(`/middleware/checkUserType`)
      .then(res => {
        if (res.data?.isAdmin) {
          setUserType('admin');
        } else if (res.data?.isUser) {
          setUserType('user');
        } else {
          setUserType(null);
        }
      })
      .catch(err => {
        console.error('Error checking user type:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing IfUser={IfUser} />} />

        {/* Auth */}
        <Route path='/auth/user-signup' element={<UserSignUp IfUser={IfUser} />} />
        <Route path='/auth/user-login' element={<UserLogin IfUser={IfUser} />} />
        <Route path='/auth/admin-signup' element={<AdminSignUp />} />

        {/* Verified path */}
        {userType === null ? (
          <Route path="*" element={<Navigate to="/" />} />
        ) : (
          <>
            {/* Admin */}
            {userType === 'admin' && (
              <>
                <Route path="/admin/*" element={<AdminIndex />} />
                <Route path="/admin/1/users/" element={<UsersPage />} />
                <Route path="/admin/1/addbook" element={<AddBook />} />
                <Route path="/admin/1/book/stockout" element={<StockOut />} />
                <Route path="/admin/1/book/request" element={<BookRequestInventory />} />
                <Route path="/admin/1/book/return" element={<BookReturn />} />
                <Route path="/admin/users/activities/:userId" element={<UserActivities />} />
                <Route path="/admin/users/profile/:user_id" element={<UserProfile />} />
                <Route path="/admin/1/profile" element={<Profile />} />
                <Route path="/admin/books/bookInventory/*" element={<BookInventory />} />
                <Route path="/admin/books/1/update/:bookid" element={<EditBook />} />
                <Route path="/admin/mail/config/1" element={<MailConfigPage />} />
              </>
            )}

            {/* User */}
            {(userType === 'user' || userType === 'admin') && (
              <>
                <Route path='/user/dashboard/:page' element={<UserDashboard />} />
                <Route path='/user/books/return-renew' element={<RenewReturn />} />
                <Route path='/user/1/profile' element={<UserProfile1 />} />
              </>
            )}
          </>
        )}
        {/* Books */}
        <Route path="/books/*" element={<BooksPage />} />
        <Route path="/books/details/:bookid" element={<BooksDetails />} />
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default App;