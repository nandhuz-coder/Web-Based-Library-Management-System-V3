import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

//Landing
import Landing from './landing/Landing';

//Footer
import Footer from './partials/Footer/Footer';

//Auth
import AdminLogin from './Auth/AdminLogin/AdminLogin';
import AdminSignUp from './Auth/AdminSignup/AdminSignup';
import UserSignUp from './Auth/UserSignup/userSignup';

//Books
import BooksPage from './book/books';
import BooksDetails from './book/book-details';

//Admin
import AdminIndex from './admin/admin-main/index';
import BookInventory from './admin/admin-BookInventory/book-inventory';
import EditBook from './admin/Admin-BookUpdate/Bookupdate';
import UsersPage from './admin/Admin-users-list/users';
import AddBook from './admin/admin-AddBook/AddBook';
import StockOut from './admin/admin-StockOut/stockout';
import BookRequestInventory from './admin/admin-RequestBook/RequestBook';
import BookReturn from './admin/admin-return/return';
import UserActivities from './admin/Admin-Activities/Activities';
import UserProfile from './admin/Admin-UserProfile/Userprofile';
import Profile from './admin/Admin-profile/profile';

const IfUser = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('/middleware/ifuser')
      .then(res => {
        if (res.data.redirect) {
          navigate(res.data.redirect);
        }
      })
      .catch(err => {
        console.log('Error checking user:', err);
      });
  }, [navigate]);

  return null;
};

const IfAdmin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('/middleware/ifadmin')
      .then(res => {
        if (!res.data.flag) {
          navigate('/');
        }
      }).catch(err => {
        console.log('Error checking user:', err);
      });
  }, [navigate]);
  return null;
};

const IsUser = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('/middleware/isuser')
      .then(res => {
        if (!res.data.flag) {
          navigate('/');
        }
      }).catch(err => {
        console.log('Error checking user:', err);
      });
  }, [navigate]);
  return null;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing IfUser={IfUser} />} />
          <Route path="/auth/admin-login" element={<AdminLogin IfUser={IfUser} />} />
          <Route path='/auth/user-signup' element={<UserSignUp IfUser={IfUser} />} />
          <Route path="/admin/*" element={<AdminIndex IfAdmin={IfAdmin} />} />
          <Route path="/books/*" element={<BooksPage />} />
          <Route path="/books/details/:bookid" element={<BooksDetails />} />
          <Route path="/admin/books/bookInventory/*" element={<BookInventory IfAdmin={IfAdmin} />} />
          <Route path="/admin/books/1/update/:bookid" element={<EditBook IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/users/" element={<UsersPage IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/addbook" element={<AddBook IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/book/stockout" element={<StockOut IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/book/request" element={<BookRequestInventory IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/book/return" element={<BookReturn IfAdmin={IfAdmin} />} />
          <Route path="/admin/users/activities/:userId" element={<UserActivities IfAdmin={IfAdmin} />} />
          <Route path="/admin/users/profile/:user_id" element={<UserProfile IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/profile" element={<Profile IfAdmin={IfAdmin} />} />
          <Route path='/auth/admin-signup' element={<AdminSignUp />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
