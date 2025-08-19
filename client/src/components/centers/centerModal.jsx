import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Stack } from 'react-bootstrap';
import AddressSelectionModal from '../shared/addressSelectionModal';
import AddressFormModal from '../shared/addressFormModal';

export default function CenterModal({ show, center, onCancel, onSave }) {
    const [formData, setFormData] = useState({});
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressSelector, setShowAddressSelector] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);

    useEffect(() => {
        setFormData({
            name: center?.name || '',
            type: center?.type || '',
            contact_email: center?.contact_email || '',
            contact_phone: center?.contact_phone || ''
        });
        setSelectedAddress(center?.address || null);
    }, [center]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = () => {
        if (!selectedAddress?.address_id) {
            alert('Please select or create an address for the center.');
            return;
        }
        console.log(`there is an id for address ${selectedAddress.address_id}`);
        onSave({ ...center, ...formData, address_id: selectedAddress.address_id });
    };

    const handleAddressSelected = (address) => {
        setSelectedAddress(address);
        setShowAddressSelector(false);
    };
    
    const handleNewAddressSaved = (newAddress) => {
        setSelectedAddress(newAddress);
        setShowAddressForm(false);
    };
    
    const formatAddress = (addr) => addr ? `${addr.street}, ${addr.city}, ${addr.state}` : 'None Selected';

    return (
        <>
            <Modal show={show} onHide={onCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{center?.center_id ? 'Edit Center' : 'Create New Center'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Center details form groups */}
                        <Form.Group className="mb-3"><Form.Label>Center Name</Form.Label><Form.Control name="name" value={formData.name} onChange={handleChange} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Center Type</Form.Label><Form.Control name="type" value={formData.type} onChange={handleChange} /></Form.Group>
                        <Row>
                            <Col><Form.Group className="mb-3"><Form.Label>Contact Email</Form.Label><Form.Control type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} /></Form.Group></Col>
                            <Col><Form.Group className="mb-3"><Form.Label>Contact Phone</Form.Label><Form.Control type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} /></Form.Group></Col>
                        </Row>
                        {/* Address management section */}
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Card body className="bg-light">{formatAddress(selectedAddress)}</Card>
                        </Form.Group>
                        <Stack direction="horizontal" gap={2}>
                            <Button variant="outline-secondary" size="sm" onClick={() => setShowAddressSelector(true)}>Select Existing</Button>
                            <Button variant="outline-primary" size="sm" onClick={() => setShowAddressForm(true)}>Create New</Button>
                        </Stack>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save Center</Button>
                </Modal.Footer>
            </Modal>
            
            {/* Render the nested modals */}
            <AddressSelectionModal show={showAddressSelector} onCancel={() => setShowAddressSelector(false)} onSelect={handleAddressSelected} />
            <AddressFormModal show={showAddressForm} onCancel={() => setShowAddressForm(false)} onSave={handleNewAddressSaved} />
        </>
    );
}