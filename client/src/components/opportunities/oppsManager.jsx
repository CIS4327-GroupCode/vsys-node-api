// OpportunitiesManager.jsx
import React, { useState, useEffect, useCallback } from 'react';

// A separate component for the Create/Edit form for better organization.
function OpportunityForm({ opportunity, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        role: '',
        center_id: '',
        valid_until: '',
    });

    useEffect(() => {
        if (opportunity) {
            // Format valid_until for the datetime-local input
            const formattedDate = opportunity.valid_until 
                ? new Date(opportunity.valid_until).toISOString().slice(0, 16) 
                : '';
            setFormData({
                title: opportunity.title || '',
                description: opportunity.description || '',
                role: opportunity.role || '',
                center_id: opportunity.center_id || '',
                valid_until: formattedDate,
            });
        }
    }, [opportunity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...opportunity, ...formData });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{opportunity?.opportunity_id ? 'Edit Opportunity' : 'Create New Opportunity'}</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Opportunity Title" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
                    <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" required />
                    {/* In a real app, this would be a dropdown populated from the /api/centers endpoint */}
                    <input type="number" name="center_id" value={formData.center_id} onChange={handleChange} placeholder="Center ID" required />
                    <input type="datetime-local" name="valid_until" value={formData.valid_until} onChange={handleChange} required />
                    <div className="form-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export function OpportunitiesManager() {
    const [opportunities, setOpportunities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for the modal form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOpportunity, setCurrentOpportunity] = useState(null);

    const fetchOpportunities = useCallback(() => {
        setIsLoading(true);
        fetch('/api/opportunities')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setOpportunities(data);
                setError(null);
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);
    
    // --- CRUD Handlers ---

    const handleSave = (opportunityData) => {
        const isUpdating = !!opportunityData.opportunity_id;
        const method = isUpdating ? 'PUT' : 'POST';
        const url = isUpdating ? `/api/opportunities/${opportunityData.opportunity_id}` : '/api/opportunities';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(opportunityData),
        })
        .then(res => {
            if (!res.ok) throw new Error(isUpdating ? 'Update failed' : 'Create failed');
            return res.json();
        })
        .then(() => {
            fetchOpportunities(); // Re-fetch the list to show the changes
            setIsModalOpen(false);
            setCurrentOpportunity(null);
        })
        .catch(err => setError(err.message));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
            fetch(`/api/opportunities/${id}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Delete failed');
                fetchOpportunities(); // Re-fetch to update the list
            })
            .catch(err => setError(err.message));
        }
    };
    
    // --- Modal Control ---
    
    const openCreateModal = () => {
        setCurrentOpportunity({}); // Empty object for a new opportunity
        setIsModalOpen(true);
    };

    const openUpdateModal = (opportunity) => {
        setCurrentOpportunity(opportunity);
        setIsModalOpen(true);
    };

    const filtered = opportunities.filter((opp) =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="opportunity-manager">
            <h3>Manage Opportunities</h3>
            <div className="toolbar">
                <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={openCreateModal}>+ Create New</button>
            </div>
            
            {isLoading && <p>Loading opportunities...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            {!isLoading && !error && (
                <ul className="opportunity-list">
                    {filtered.map((opp) => (
                        <li key={opp.opportunity_id}>
                            <div className="opportunity-info">
                                <strong>{opp.title}</strong> ({opp.role})
                                <small>At: {opp.center_name} | Expires: {new Date(opp.valid_until).toLocaleDateString()}</small>
                                <p>{opp.description}</p>
                            </div>
                            <div className="opportunity-actions">
                                <button onClick={() => openUpdateModal(opp)}>Edit</button>
                                <button onClick={() => handleDelete(opp.opportunity_id)} className="delete-btn">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isModalOpen && (
                <OpportunityForm 
                    opportunity={currentOpportunity}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
        </section>
    );
}