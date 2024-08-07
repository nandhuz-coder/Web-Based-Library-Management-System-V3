import React, { useState, Suspense } from 'react';
import { useNavigate } from "react-router-dom"
import Alert from '../../partials/Header/alert/alert';
import Loading from '../../Loading/Loading'
import AdminNAvbar from '../../partials/Header/Admin-nav/admin-nav'
import axios from 'axios';
const AddBook = ({ IfAdmin }) => {
    const [alerts, setAlerts] = useState({ error: '', success: '', warning: '' });
    const [book, setBook] = useState({
        title: '',
        author: '',
        ISBN: '',
        category: '',
        stock: '',
        description: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.post("/api/admin/add/book", { book }).then((res => {
                console.log(res.data);
                if (res.data.success) setAlerts({ ...alerts, success: res.data.success, error: '', warning: '' });
                if (res.data.error) setAlerts({ ...alerts, success: '', error: res.data.error, warning: '' });
            }))
            navigate('/admin/books/bookInventory/');
        } catch (error) {
            setAlerts({ ...alerts, error: error, success: '', warning: '' });
            console.log(error);
        }
    };

    const dismissAlert = (type) => {
        setAlerts({ ...alerts, [type]: '' });
    };

    return (
        <>
            <IfAdmin />
            <Suspense fallback={<Loading />}>
                <AdminNAvbar />
                <header id="main-header" className="py-2 bg-primary text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h1><i className="fa fa-gear"></i> Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container">
                    <div className="row">
                        <Alert
                            error={alerts.error}
                            success={alerts.success}
                            warning={alerts.warning}
                            dismissAlert={dismissAlert}
                        />
                        <div className="col card" style={{ marginTop: '20px', marginBottom: '20px', border: '1px solid black' }}>
                            <div className="card-header text-center" style={{ background: 'rgb(100, 170, 236)' }}>
                                <h4>Add Book</h4>
                            </div>

                            <form className="p-3" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-control-label">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                id="book-title"
                                                placeholder="Book Title"
                                                className="form-control"
                                                value={book.title}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-control-label">Author Name</label>
                                            <input
                                                type="text"
                                                name="author"
                                                id="book-author"
                                                placeholder="Author Name"
                                                className="form-control"
                                                value={book.author}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-control-label">ISBN</label>
                                            <input
                                                type="text"
                                                name="ISBN"
                                                id="book-ISBN"
                                                placeholder="ISBN"
                                                className="form-control"
                                                value={book.ISBN}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-control-label">Category</label>
                                            <select
                                                className="form-control"
                                                name="category"
                                                id="book-category"
                                                value={book.category}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Book Category</option>
                                                <option value="Fiction">Fiction</option>
                                                <option value="Novel">Novel</option>
                                                <option value="Short Story">Short Story</option>
                                                <option value="Educational">Educational</option>
                                                <option value="Religious">Religious</option>
                                                <option value="History">History</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-control-label">Stock</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                id="book-stock"
                                                placeholder="Book Stocks"
                                                className="form-control"
                                                value={book.stock}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-control-label">Book Description</label>
                                            <textarea
                                                name="description"
                                                id="book-description"
                                                cols="30"
                                                rows="5"
                                                className="form-control"
                                                value={book.description}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        id="add-book-btn"
                                        style={{ width: '50%', marginLeft: '25%' }}
                                    >
                                        Add Book
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    );
};

export default AddBook;
