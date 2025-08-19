import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Spinner, Alert, Stack, Row } from 'react-bootstrap';
import CenterModal from './centerModal';
import CenterCard from './centerCard';

export default function CentersManager() {
    const [centers, setCenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentCenter, setCurrentCenter] = useState(null);

    const fetchCenters = useCallback(() => {
        setIsLoading(true);
        fetch('http://localhost:3000/api/centers')
            .then(res => res.json())
            .then(data => { setCenters(data); setError(null); })
            .catch(err => setError(err.message || 'Failed to fetch centers'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => { fetchCenters(); }, [fetchCenters]);

    const handleSave = (centerData) => {
        const isUpdating = !!centerData.center_id;
        const method = isUpdating ? 'PUT' : 'POST';
        const url = isUpdating ? `/api/centers/${centerData.center_id}` : '/api/centers';

        fetch(`http://localhost:3000${url}`, {
            method,
            authorization: `Bearer ${localStorage.getItem('token')}`,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(centerData),
        })
        .then(res => { if (!res.ok) throw new Error('Save failed'); return res.json(); })
        .then(() => {
            fetchCenters();
            setShowModal(false);
            setCurrentCenter(null);
        })
        .catch(err => setError(err.message));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(`http://localhost:3000/api/centers/${id}`, { method: 'DELETE', authorization: `Bearer ${localStorage.getItem('token')}` })
                .then(res => { if (!res.ok) throw new Error('Delete failed'); fetchCenters(); })
                .catch(err => setError(err.message));
        }
    };
    
    const openCreateModal = () => { setCurrentCenter(null); setShowModal(true); };
    const openUpdateModal = (center) => { setCurrentCenter(center); setShowModal(true); };

    return (
        <Container className="my-4">
            <Stack direction="horizontal" className="mb-3">
                <h3 className="me-auto">Manage Centers</h3>
                <Button variant="primary" onClick={openCreateModal}>+ Create New Center</Button>
            </Stack>

            {isLoading && <div className="text-center"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!isLoading && !error && (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {centers.map(center => (
                        <CenterCard
                            key={center.center_id}
                            center={center}
                            onEdit={openUpdateModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </Row>
            )}

            {showModal && (
                <CenterModal
                    show={showModal}
                    center={currentCenter}
                    onCancel={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </Container>
    );
}