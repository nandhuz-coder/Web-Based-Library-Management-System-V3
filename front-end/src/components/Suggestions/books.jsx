import React, { useState } from 'react';

const SearchBar = ({ handleSubmit }) => {
    const [filter, setFilter] = useState('');
    const [category, setCategory] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const categories = [
        "Science",
        "Biology",
        "Physics",
        "Chemistry",
        "Novel",
        "Travel",
        "Cooking",
        "Philosophy",
        "Mathematics",
        "Ethics",
        "Technology",
    ];

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCategory('');
        setSearchValue('');
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const value = filter === 'category' ? category : searchValue;
        handleSubmit(event, filter, value);
    };

    return (
        <section id="search_bar" className="my-3 py-4" style={{ background: 'rgb(52, 185, 174)' }}>
            <div className="container">
                <form onSubmit={onSubmit}>
                    <div className="row">
                        <div className="col-md-5 p-1">
                            <select
                                name="filter"
                                id="filter"
                                className="form-control"
                                value={filter}
                                onChange={handleFilterChange}
                            >
                                <option value="" disabled>Select Filter...</option>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="category">Category</option>
                                <option value="ISBN">ISBN</option>
                            </select>
                        </div>
                        {filter === 'category' && (
                            <div className="col-md-5 p-1">
                                <select
                                    name="category"
                                    id="category"
                                    className="form-control"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="" disabled>Select Category...</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {filter !== 'category' && (
                            <div className="col-md-5 p-1">
                                <input
                                    name="searchName"
                                    id="searchName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Search Books"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="col-md-2 p-1">
                            <input
                                type="submit"
                                id="search-book-btn"
                                className="btn btn-warning btn-block"
                                value="Search"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </section >
    );
};

export default SearchBar;