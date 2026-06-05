import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';
import {urlConfig} from '../../config';

function SearchPage() {
    //Task 1: Define state variables for the search query, age range, and search results.
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    const handleSearch = async () => {
        // Construct the search URL based on user input
        const baseUrl = `${urlConfig.backendUrl}/search?`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect').value,
            condition: document.getElementById('conditionSelect').value
        }).toString();
        try {
            const response = await fetch(`${baseUrl}${queryParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };
    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center mb-5">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5><b>Filters</b></h5>
                        <div className="d-flex flex-column">
                            <label htmlFor="categorySelect">Category</label>
                            <select id="categorySelect" className="form-control my-1">
                                <option value="">All</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <label htmlFor="conditionSelect">Condition</label>
                            <select id="conditionSelect" className="form-control my-1">
                                    <option value="">All</option>
                                {conditions.map((condition) => (
                                    <option key={condition} value={condition}>{condition}</option>
                                ))}
                            </select>
                            <label htmlFor="ageRange">Less than {ageRange} years</label>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                className="form-control-range" id="ageRange"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search for items..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-primary search-button" onClick={handleSearch}>Search</button>
                </div>
            </div>
            <div className="row">
                {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                        <div key={product.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card product-card">
                                <div className="image-placeholder">
                                    <img src={product.image || '/logo192.png'} alt={product.name} className="card-img-top" />
                                </div>
                                <div className="card-body">
                                    <h2 className="card-title">
                                        {product.name}
                                    </h2>
                                    <p className={`card-text ${getConditionClass(product.condition)}`}>
                                        {product.condition}
                                    </p>
                                    <p className="card-text">
                                        {formatDate(product.date_added)}
                                    </p>
                                    <button onClick={() => goToDetailsPage(product.id)} className="btn btn-primary">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    loading ? (
                        <div className="col-12">
                            <div className="alert" role="alert">
                                Loading...
                            </div>
                        </div>
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-info" role="alert">
                                No products found. Please revise your filters.
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default SearchPage;
