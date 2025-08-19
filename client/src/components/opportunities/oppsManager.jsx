// OpportunitiesManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Button, Form, Modal, Spinner, Alert,
    ListGroup, Stack, Row, Col, ButtonGroup
} from 'react-bootstrap';

// The form is now inside a React Bootstrap Modal
function OpportunityModal({ show, opportunity, onSave, onCancel }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Pre-fill form data when the opportunity to edit is passed in
        const formattedDate = opportunity?.valid_until
            ? new Date(opportunity.valid_until).toISOString().slice(0, 16)
            : '';
        setFormData({
            title: opportunity?.title || '',
            description: opportunity?.description || '',
            role: opportunity?.role || '',
            center_id: opportunity?.center_id || '',
            valid_until: formattedDate,
        });
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
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {opportunity?.opportunity_id ? 'Edit Opportunity' : 'Create New Opportunity'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Opportunity Title</Form.Label>
                        <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Community Fair Staff" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formRole">
                                <Form.Label>Role</Form.Label>
                                <Form.Control type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g., Event Helper" required />
                            </Form.Group>
                        </Col>
                        <Col>
                            {/* In a real app, this would be a Form.Select populated from an API */}
                            <Form.Group className="mb-3" controlId="formCenterId">
                                <Form.Label>Center ID</Form.Label>
                                <Form.Control type="number" name="center_id" value={formData.center_id} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="formValidUntil">
                        <Form.Label>Valid Until</Form.Label>
                        <Form.Control type="datetime-local" name="valid_until" value={formData.valid_until} onChange={handleChange} required />
                    </Form.Group>
                    {/* The buttons are moved to Modal.Footer for standard placement */}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
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
                if (!res.ok) throw new Error('Network response was not ok.');
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

    // --- CRUD Handlers (with improved response handling) ---
    const handleSave = (opportunityData) => {
        console.log('Saving opportunity:', opportunityData);
        const isUpdating = !!opportunityData.opportunity_id;
        const method = isUpdating ? 'PUT' : 'POST';
        const url = isUpdating ? `/api/opportunities/${opportunityData.opportunity_id}` : '/api/opportunities';

        fetch(`http://localhost:3000${url}`, {
            method: method,
            headers: { 'Content-Type': 'application/json', authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(opportunityData),
        })
        .then(res => {
            if (!res.ok) throw new Error(isUpdating ? 'Update failed' : 'Create failed');
            // Only parse JSON if there's a body. POST/PUT should return the updated/created object.
            return res.json();
        })
        .then(() => {
            fetchOpportunities();
            setIsModalOpen(false);
            setCurrentOpportunity(null);
        })
        .catch(err => setError(err.message));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
            fetch(`/api/opportunities/${id}`, { method: 'DELETE', 
                headers: { 'Content-Type': 'application/json', authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => {
                if (!res.ok) throw new Error('Delete failed');
                // A successful DELETE often returns a 204 No Content, which has no body.
                fetchOpportunities();
            })
            .catch(err => setError(err.message));
        }
    };

    // --- Modal Control ---
    const openCreateModal = () => {
        setCurrentOpportunity(null); // Use null for create mode
        setIsModalOpen(true);
    };

    const openUpdateModal = (opportunity) => {
        setCurrentOpportunity(opportunity);
        setIsModalOpen(true);
    };

    const filteredOpportunities = opportunities.filter((opp) =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="my-4">
            <h3 className="mb-3 text-center">Manage Opportunities</h3>
            <Stack direction="horizontal" gap={3} className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" onClick={openCreateModal} className="text-nowrap">+ Create New</Button>
            </Stack>

            {isLoading && <div className="text-center"><Spinner animation="border" /> <span className="ms-2">Loading...</span></div>}
            {error && <Alert variant="danger">Error: {error}</Alert>}

            {!isLoading && !error && (
                <ListGroup>
                    {filteredOpportunities.map((opp) => (
                        <ListGroup.Item key={opp.opportunity_id} className="d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">{opp.title} ({opp.role})</div>
                                <div className="text-muted mb-2">
                                    <small>At: {opp.center_name} | Expires: {new Date(opp.valid_until).toLocaleDateString()}</small>
                                </div>
                                {opp.description}
                            </div>
                            <ButtonGroup>
                                <Button variant="outline-secondary" size="sm" onClick={() => openUpdateModal(opp)}>Edit</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(opp.opportunity_id)}>Delete</Button>
                            </ButtonGroup>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            <OpportunityModal
                show={isModalOpen}
                opportunity={currentOpportunity}
                onSave={handleSave}
                onCancel={() => setIsModalOpen(false)}
            />
        </Container>
    );
}