import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';

export default function AddressFormModal({ show, onCancel, onSave }) {
    const [formData, setFormData] = useState({ street: '', city: 'Jacksonville', state: 'FL', zip: '', country: 'United States' });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = () => {
        setIsSaving(true);
        fetch('http://localhost:3000/api/address', {//create address
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(newAddress => onSave(newAddress)) // Pass the new address object back
        .catch(console.error)
        .finally(() => setIsSaving(false));
    };

    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create New Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3"><Form.Label>Street</Form.Label><Form.Control name="street" onChange={handleChange} value={formData.street} /></Form.Group>
                    <Row>
                        <Col><Form.Group className="mb-3"><Form.Label>City</Form.Label><Form.Control name="city" onChange={handleChange} value={formData.city} /></Form.Group></Col>
                        <Col><Form.Group className="mb-3"><Form.Label>State</Form.Label><Form.Control name="state" onChange={handleChange} value={formData.state} /></Form.Group></Col>
                        <Col><Form.Group className="mb-3"><Form.Label>ZIP Code</Form.Label><Form.Control name="zip" onChange={handleChange} value={formData.zip} /></Form.Group></Col>
                        <Col><Form.Group className="mb-3"><Form.Label>Country</Form.Label><Form.Control name="country" onChange={handleChange} value={formData.country} /></Form.Group></Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Spinner as="span" size="sm" /> : 'Save Address'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}