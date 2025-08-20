import React, { useState, useEffect, useCallback } from 'react';
import { Container, Spinner, Alert, Row, Form } from 'react-bootstrap';
import VolunteerCard from './VolunteerCard';
import VolunteerEditModal from './VolunteerEditModal';
import VolunteerDetailsModal from './VolunteerDetailsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function VolunteersManager() {
    const [volunteers, setVolunteers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State for modals
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

    const fetchVolunteers = useCallback(() => {
        setIsLoading(true);
        // API should join all necessary tables (user_status, user_type, address, user_skill->skill)
        fetch('/api/users')
            .then(res => res.json())
            .then(data => { setVolunteers(data); setError(null); })
            .catch(err => setError(err.message || 'Failed to fetch volunteers'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => { fetchVolunteers(); }, [fetchVolunteers]);
    
    // --- Modal Control ---
    const handleShowEdit = (volunteer) => { setSelectedVolunteer(volunteer); setShowEditModal(true); };
    const handleShowDetails = (volunteer) => { setSelectedVolunteer(volunteer); setShowDetailsModal(true); };
    const handleShowDelete = (volunteer) => { setSelectedVolunteer(volunteer); setShowDeleteModal(true); };
    const handleCloseModals = () => { setShowEditModal(false); setShowDetailsModal(false); setShowDeleteModal(false); setSelectedVolunteer(null); };

    // --- API Handlers ---
    const handleSave = (volunteerData) => {
        fetch(`http://localhost:3000/api/users/${volunteerData.username}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(volunteerData),
        })
        .then(res => { if (!res.ok) throw new Error('Update failed'); return res.json(); })
        .then(() => { fetchVolunteers(); handleCloseModals(); })
        .catch(err => setError(err.message));
    };

    const handleSoftDelete = () => {
        // Soft delete by updating the is_active flag
        fetch(`/api/users/${selectedVolunteer.username}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: false }),
        })
        .then(res => { if (!res.ok) throw new Error('Deactivation failed'); fetchVolunteers(); handleCloseModals(); })
        .catch(err => setError(err.message));
    };

    const handleHardDelete = () => {
        fetch(`/api/users/${selectedVolunteer.username}`, { method: 'DELETE' })
        .then(res => { if (!res.ok) throw new Error('Permanent delete failed'); fetchVolunteers(); handleCloseModals(); })
        .catch(err => setError(err.message));
    };

    const filteredVolunteers = volunteers.filter(v =>
        v.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${v.first_name} ${v.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="my-4">
            <Alert variant="info">
                New volunteers must register through the public registration form. Use this dashboard to approve, manage, and edit existing users.
            </Alert>
            <Form.Control type="text" placeholder="Search by name or username..." className="mb-3" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

            {isLoading && <div className="text-center"><Spinner /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!isLoading && !error && (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {filteredVolunteers.map(volunteer => (
                        <VolunteerCard
                            key={volunteer.username}
                            volunteer={volunteer}
                            onEdit={handleShowEdit}
                            onDelete={handleShowDelete}
                            onShowDetails={handleShowDetails}
                        />
                    ))}
                </Row>
            )}

            {/* Modals */}
            {showEditModal && <VolunteerEditModal show={showEditModal} volunteer={selectedVolunteer} onCancel={handleCloseModals} onSave={handleSave} />}
            {showDetailsModal && <VolunteerDetailsModal show={showDetailsModal} volunteer={selectedVolunteer} onCancel={handleCloseModals} />}
            {showDeleteModal && <DeleteConfirmationModal show={showDeleteModal} onCancel={handleCloseModals} onSoftDelete={handleSoftDelete} onHardDelete={handleHardDelete} />}
        </Container>
    );
}