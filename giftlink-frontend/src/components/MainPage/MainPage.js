import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
         // fetch all gifts
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/gifts`;
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGifts();
    }, []);

    // Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    // Format timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.length > 0 ? (
                    gifts.map((gift) => (
                        <div key={gift.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card product-card">
                                <div className="image-placeholder">
                                    <img src={gift.image || '/logo192.png'} alt={gift.name} className="card-img-top" />
                                </div>
                                <div className="card-body">
                                    <h2 className="card-title">
                                        {gift.name}
                                    </h2>
                                    <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                        {gift.condition}
                                    </p>
                                    <p className="card-text">
                                        {formatDate(gift.date_added)}
                                    </p>
                                    <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
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
                            <div className="alert" role="alert">
                                No gifts found
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default MainPage;
