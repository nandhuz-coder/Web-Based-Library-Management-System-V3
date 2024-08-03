import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './partials/Footer/Footer';
import Landing from './landing/Landing';
import AdminLogin from './admin/AdminLogin/AdminLogin';
import AdminIndex from './admin/admin-main/index';
import BooksPage from './book/books';
import BooksDetails from './book/book-details';
import BookInventory from './admin/admin-BookInventory/book-inventory';
import EditBook from './admin/Admin-BookUpdate/Bookupdate';
import UsersPage from './admin/Admin-users-list/users';
import AddBook from './admin/admin-AddBook/AddBook';
import StockOut from './admin/admin-StockOut/stockout';
import BookRequestInventory from './admin/admin-RequestBook/RequestBook';


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
          <Route path="/admin/*" element={<AdminIndex IfAdmin={IfAdmin} />} />
          <Route path="/books/*" element={<BooksPage />} />
          <Route path="/books/details/:bookid" element={<BooksDetails />} />
          <Route path="/admin/books/bookInventory/*" element={<BookInventory IfAdmin={IfAdmin} />} />
          <Route path="/admin/books/1/update/:bookid" element={<EditBook IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/users/" element={<UsersPage IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/addbook" element={<AddBook IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/book/stockout" element={<StockOut IfAdmin={IfAdmin} />} />
          <Route path="/admin/1/book/request" element={<BookRequestInventory IfAdmin={IfAdmin} />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
