// MyOpportunities.jsx
import React, { useEffect, useState } from 'react';

export function MyOpportunities({ userId }) {
    const [myOpps, setMyOpps] = useState([]);

    useEffect(() => {
        fetch(`/api/users/${userId}/opportunities`)
            .then((res) => res.json())
            .then((data) => setMyOpps(data))
            .catch((err) => console.error('Failed to fetch user opportunities', err));
    }, [userId]);

    return (
        <section>
            <h3>My Opportunities</h3>
            {myOpps.length === 0 ? (
                <p>You haven't participated in any opportunities yet.</p>
            ) : (
                <ul>
                    {myOpps.map((opp) => (
                        <li key={opp.id}>
                            <strong>{opp.title}</strong> — {opp.status}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}