import React, { useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

/**
 * Fetches title suggestions from the server.
 * @param {string} name - The name to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of title suggestions.
 */
async function fetchTitleSuggestions(name) {
    console.log('fetchTitleSuggestions:', name);

    try {
        const response = await axios.get('/api/suggestion/books', {
            params: { q: name }
        });
        return response.data;  // Ensure this is an array of suggestions
    } catch (error) {
        console.error('Error fetching title suggestions:', error);
        return [];
    }
}

const SearchBar = ({ handleSubmit }) => {
    const [filter, setFilter] = useState('');
    const [category, setCategory] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

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

    const debouncedFetchSuggestions = useCallback(debounce(async (value) => {
        const suggestions = await fetchTitleSuggestions(value);
        setSuggestions(suggestions);
    }, 400), []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCategory('');
        setSearchValue('');
        setSuggestions([]);
    };

    const handleSearchValueChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        if (filter === 'title' && value.length >= 3) {
            debouncedFetchSuggestions(value);  // Fetch suggestions if filter is title
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchValue(suggestion);  // Set search value to clicked suggestion
        setSuggestions([]);  // Clear suggestions after click
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
                                    onChange={handleSearchValueChange}
                                />
                                {filter === 'title' && Array.isArray(suggestions) && suggestions.length > 0 && (
                                    <ul className="list-group suggestions-list" style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
                                        {suggestions.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
        </section>
    );
};

export default SearchBar;