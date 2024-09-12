import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UserNav from "../partials/Header/User-nav/user-nav";
import Navbar from "../partials/Header/nav/nav";
import Alert from "../partials/Header/alert/alert";

const BooksDetails = () => {
    const { bookid } = useParams();
    const [book, setBook] = useState({});
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [user, setUser] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                await axios.get(`/api/books/details/${bookid}`).then(async (res) => {
                    const data = await res.data
                    if (data.error) {
                        setUser(data.IsUser);
                        setError(data.error);
                        return;
                    }
                    setBook(data.book);
                    setCurrentUser(data.user);
                    setComments(data.book.comments ? data.book.comments : []);
                })
            } catch (error) {
                console.log("Error fetching book details:", error);
            }
        };
        fetchBookDetails();
    }, [bookid]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`/api/books/${book._id}/comment`, { comment });
            setComments(data.comments);
            setComment('');
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const { data } = await axios.delete(`/api/books/${book._id}/comments/${commentId}`);
            setComments(data.comments);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleEditComment = async (commentId, text) => {
        try {
            const { data } = await axios.put(`/api/books/${book._id}/comments/${commentId}`, { text });
            setComments(data.comments);
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    return (
        <>
            {user ? (<UserNav />) : (<Navbar />)}
            <Alert error={error} dismissAlert={() => setError('')} />
            <div className="container mt-3">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-header" style={{ background: 'rgb(100, 170, 236)' }}>
                                <h4 className="text-center" style={{ color: 'green' }}>{book.title}</h4>
                            </div>
                            <h5 className="px-3 py-2">
                                <span style={{ color: 'red', fontWeight: 'bold' }}>Author: </span>{book.author}
                            </h5>
                            <h5 className="px-3 py-2">
                                <span style={{ color: 'red', fontWeight: 'bold' }}>ISBN: </span>{book.ISBN}
                            </h5>
                            <h5 className="px-3 py-2">
                                <span style={{ color: 'red', fontWeight: 'bold' }}>Category: </span>{book.category}
                            </h5>
                            <h5 className="px-3 py-2">
                                <span style={{ color: 'red', fontWeight: 'bold' }}>In Stock: </span>{book.stock}
                            </h5>
                            <div className="card-body">
                                <h6 className="card-text" style={{ color: 'blue' }}>{book.description}</h6>
                            </div>
                        </div>

                        <div className="card my-3 bg-light">
                            {user && currentUser && (
                                <>
                                    <p className="p-3">
                                        <button
                                            className="btn btn-primary float-right"
                                            type="button"
                                            data-toggle="collapse"
                                            data-target="#collapseCommentBox"
                                            aria-expanded="false"
                                            aria-controls="collapseCommentBox"
                                        >
                                            Leave a comment
                                        </button>
                                    </p>
                                    <div className="collapse" id="collapseCommentBox">
                                        <form onSubmit={handleCommentSubmit}>
                                            <textarea name="comment" className="form-control" value={comment} onChange={handleCommentChange}></textarea>
                                            <input type="submit" className="btn btn-outline-success btn-sm m-1 float-right" />
                                        </form>
                                    </div>
                                </>
                            )}

                            <ul className="list-group list-group-flush">
                                {comments.map((comment) => (
                                    <li className="list-group-item" key={comment._id}>
                                        <strong>{comment.author.username}</strong>
                                        <span><em> at {new Date(comment.date).toDateString()}</em></span>
                                        <p>{comment.text}</p>

                                        {user && currentUser && comment.author.id === currentUser._id && (
                                            <>
                                                <button id="edit" className="btn btn-primary px-1 py-0">
                                                    <i className="fa fa-pencil"></i>
                                                </button>

                                                <form className="d-inline" onSubmit={(e) => { e.preventDefault(); handleDeleteComment(comment._id); }}>
                                                    <button className="btn btn-sm btn-danger px-1 py-0">
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </form>

                                                <div className="d-none" id="editCommentBox">
                                                    <form onSubmit={(e) => { e.preventDefault(); handleEditComment(comment._id, comment.text); }}>
                                                        <textarea name="comment[text]" className="form-control" defaultValue={comment.text}></textarea>
                                                        <input type="submit" className="btn btn-outline-success btn-sm m-1 float-right" />
                                                    </form>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BooksDetails;
