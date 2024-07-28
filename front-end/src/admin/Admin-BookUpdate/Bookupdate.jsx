import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../partials/Header/alert/alert';
import Loading from '../../Loading/Loading';

const EditBook = ({ IfAdmin }) => {
    const { bookid } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`/admin/book/update/${bookid}`);
                setBook(response.data.book);
            } catch (err) {
                console.log(err);
                setError('Error fetching book data');
            }
        };

        fetchBook();
    }, [bookid]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/admin/book/update/${bookid}`, { book });
            if (response.data.success) {
                setSuccess(response.data.success);
                navigate('/admin/books/bookInventory/');
            } else if (response.data.error) {
                setError(response.data.error);
            }
        } catch (err) {
            console.log(err);
            setError('Error updating book');
        }
    };

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    return (
        <>
            {IfAdmin && <IfAdmin />}
            <Suspense fallback={<Loading />}>
                <div className="container my-4">
                    <div className="row justify-content-center">
                        <div className="col card" style={{ marginTop: '20px', marginBottom: '20px', border: '1px solid black', paddingTop: '20px', paddingBottom: '20px' }}>
                            <div className="card-header text-center" style={{ background: 'rgb(100, 170, 236)', marginBottom: '10px' }}>
                                <h4>Edit Book</h4>
                            </div>
                            <Alert success={success} error={error} dismissAlert={dismissAlert} />
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="title" className="form-control-label">Edit Title</label>
                                            <input name="title" type="text" className="form-control" value={book.title || ''} onChange={handleInputChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="author" className="form-control-label">Edit Author</label>
                                            <input name="author" type="text" className="form-control" value={book.author || ''} onChange={handleInputChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="category" className="form-control-label">Edit Category</label>
                                            <select className="form-control" name="category" value={book.category || ''} onChange={handleInputChange} required>
                                                <option value="Fiction">Fiction</option>
                                                <option value="Novel">Novel</option>
                                                <option value="Short Story">Short Story</option>
                                                <option value="Educational">Educational</option>
                                                <option value="Religious">Religious</option>
                                                <option value="History">History</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="ISBN" className="form-control-label">ISBN</label>
                                            <input name="ISBN" type="text" className="form-control" readOnly value={book.ISBN || ''} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="stock" className="form-control-label">Stock</label>
                                            <input type="number" id="book-stock" name="stock" value={book.stock || ''} className="form-control" onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Edit Description</label>
                                            <textarea name="description" cols="30" rows="10" className="form-control" value={book.description || ''} onChange={handleInputChange}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-block" id="update-book-btn" style={{ width: '50%', marginLeft: '25%' }}>Update!</button>
                            </form>
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    );
};

export default EditBook;
