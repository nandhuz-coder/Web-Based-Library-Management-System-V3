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
    const [success, setSuccess] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [user, setUser] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await axios.get(`/api/books/details/${bookid}`);
                const data = await res.data;
                if (data.error) {
                    setUser(data.IsUser);
                    setError(data.error);
                    return;
                }
                setUser(data.IsUser);
                setBook(data.book);
                setCurrentUser(data.user);
                setComments(data.book.comments ? data.book.comments : []);
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
            const { data } = await axios.post(`/api/user/books/details/${book._id}/comment`, { comment });
            if (data.error) return setError(data.error);
            setSuccess(data.success);
            setComments(data.comments);
            setComment('');
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const { data } = await axios.delete(`/api/user/books/details/delete/${book._id}/${commentId}`);
            if (data.error) return setError(data.error);
            setSuccess(data.success);
            setComments(data.comments);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleEditComment = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`/api/user/books/details/edit/${book._id}/${editCommentId}`, { text: editCommentText });
            if (data.error) return setError(data.error);
            setComments(data.comments);
            setSuccess(data.success);
            setEditCommentId(null);
            setEditCommentText('');
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    const handleEditCommentChange = (e) => {
        setEditCommentText(e.target.value);
    };

    const toggleEditCommentBox = (commentId, text) => {
        setEditCommentId(commentId);
        setEditCommentText(text);
    };

    return (
        <>
            {user ? (<UserNav />) : (<Navbar />)}
            <Alert error={error} dismissAlert={() => setError('')} />
            <Alert success={success} dismissAlert={() => setSuccess('')} />
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
                                                <button
                                                    id="edit"
                                                    className="btn btn-primary px-1 py-0"
                                                    onClick={() => toggleEditCommentBox(comment._id, comment.text)}
                                                >
                                                    <i className="fa fa-pencil"></i>
                                                </button>

                                                <form className="d-inline" onSubmit={(e) => { e.preventDefault(); handleDeleteComment(comment._id); }}>
                                                    <button className="btn btn-sm btn-danger px-1 py-0">
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </form>

                                                {editCommentId === comment._id && (
                                                    <div id="editCommentBox">
                                                        <form onSubmit={handleEditComment}>
                                                            <textarea
                                                                name="comment[text]"
                                                                className="form-control"
                                                                value={editCommentText}
                                                                onChange={handleEditCommentChange}
                                                            ></textarea>
                                                            <input type="submit" className="btn btn-outline-success btn-sm m-1 float-right" />
                                                        </form>
                                                    </div>
                                                )}
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