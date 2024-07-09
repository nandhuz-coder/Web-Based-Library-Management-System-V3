import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './partials/Footer/Footer';
import Landing from './landing/Landing';
import AdminLogin from './admin/AdminLogin/AdminLogin';
import AdminIndex from './admin/admin-main/index';
import BooksPage from './book/Books';
import BooksDetails from './book/book-details';

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
          navigate('/')
        }
      }).catch(err => {
        console.log('Error checking user:', err);
      });
  }, [navigate])
  return null;
}

const IsUser = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('/middleware/isuser')
      .then(res => {
        if (!res.data.flag) {
          navigate('/')
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
          <Route path="/admin" element={<AdminIndex IfAdmin={IfAdmin} />} />
          <Route path="/books/*" element={<BooksPage />} />
          <Route path="/books/details/:bookid" element={<BooksDetails />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
