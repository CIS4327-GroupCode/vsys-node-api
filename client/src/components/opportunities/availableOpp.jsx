// AvailableOpportunities.jsx
import React, { useState, useEffect } from 'react';

export function AvailableOpportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/opportunities')
            .then((res) => res.json())
            .then((data) => setOpportunities(data))
            .catch((err) => console.error('Failed to fetch opportunities', err));
    }, []);

    const filtered = opportunities.filter((opp) =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section>
            <h3>Available Opportunities</h3>
            <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filtered.map((opp) => (
                    <li key={opp.id}>
                        <strong>{opp.title}</strong> — {opp.description}
                    </li>
                ))}
            </ul>
        </section>
    );
}