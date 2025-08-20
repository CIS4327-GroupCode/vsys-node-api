import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Stack } from 'react-bootstrap';
import AddressSelectionModal from '../shared/addressSelectionModal';
import AddressFormModal from '../shared/addressFormModal';

export default function VolunteerEditModal({ show, volunteer, onCancel, onSave }) {
    const [formData, setFormData] = useState({});
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState([]);

    // For populating dropdowns
    const [statuses, setStatuses] = useState([]);
    const [types, setTypes] = useState([]);
    const [allSkills, setAllSkills] = useState([]);

    // State for the nested modals
    const [showAddressSelector, setShowAddressSelector] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Fetch data for dropdowns when the modal opens
    useEffect(() => {
        if (show) {
            fetch('/api/user_statuses').then(res => res.json()).then(setStatuses);
            fetch('/api/user_types').then(res => res.json()).then(setTypes);
            fetch('/api/skills').then(res => res.json()).then(setAllSkills);
        }
    }, [show]);

    // Populate the form when a volunteer is selected
    useEffect(() => {
        if (volunteer) {
            setFormData({
                first_name: volunteer.first_name || '',
                last_name: volunteer.last_name || '',
                email: volunteer.email || '',
                status_id: volunteer.status_id || '',
                type_id: volunteer.type_id || '',
            });
            setSelectedAddress(volunteer.address || null);
            setSelectedSkills(volunteer.skills?.map(s => s.skill_id) || []);
        }
    }, [volunteer]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSkillChange = (e) => {
        const skillId = parseInt(e.target.value);
        if (e.target.checked) {
            setSelectedSkills([...selectedSkills, skillId]);
        } else {
            setSelectedSkills(selectedSkills.filter(id => id !== skillId));
        }
    };

    const handleSave = () => {
        const finalData = {
            ...volunteer,
            ...formData,
            address_id: selectedAddress?.address_id || null,
            skill_ids: selectedSkills, // Send an array of skill IDs
        };
        onSave(finalData);
    };

    const handleAddressSelected = (address) => { setSelectedAddress(address); setShowAddressSelector(false); };
    const handleNewAddressSaved = (newAddress) => { setSelectedAddress(newAddress); setShowAddressForm(false); };
    
    return (
        <>
            <Modal show={show} onHide={onCancel} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Volunteer: {volunteer?.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col><Form.Group className="mb-3"><Form.Label>First Name</Form.Label><Form.Control name="first_name" value={formData.first_name} onChange={handleChange} /></Form.Group></Col>
                            <Col><Form.Group className="mb-3"><Form.Label>Last Name</Form.Label><Form.Control name="last_name" value={formData.last_name} onChange={handleChange} /></Form.Group></Col>
                        </Row>
                        <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} /></Form.Group>
                        <Row>
                            <Col><Form.Group className="mb-3"><Form.Label>Status</Form.Label><Form.Select name="status_id" value={formData.status_id} onChange={handleChange}>{statuses.map(s => <option key={s.status_id} value={s.status_id}>{s.status_name}</option>)}</Form.Select></Form.Group></Col>
                            <Col><Form.Group className="mb-3"><Form.Label>User Type</Form.Label><Form.Select name="type_id" value={formData.type_id} onChange={handleChange}>{types.map(t => <option key={t.type_id} value={t.type_id}>{t.type_name}</option>)}</Form.Select></Form.Group></Col>
                        </Row>

                        <hr />
                        
                        {/* Address Management */}
                        <Form.Group className="mb-3"><Form.Label>Address</Form.Label><Card body className="bg-light">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}` : 'None'}</Card></Form.Group>
                        <Stack direction="horizontal" gap={2} className="mb-3">
                            <Button variant="outline-secondary" size="sm" onClick={() => setShowAddressSelector(true)}>Select Existing</Button>
                            <Button variant="outline-primary" size="sm" onClick={() => setShowAddressForm(true)}>Create New</Button>
                        </Stack>

                        <hr />

                        {/* Skills Management */}
                        <Form.Group className="mb-3"><Form.Label>Skills</Form.Label>
                            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #dee2e6', padding: '10px', borderRadius: '5px' }}>
                                {allSkills.map(skill => (
                                    <Form.Check key={skill.skill_id} type="checkbox" label={skill.name} value={skill.skill_id} checked={selectedSkills.includes(skill.skill_id)} onChange={handleSkillChange} />
                                ))}
                            </div>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            
            <AddressSelectionModal show={showAddressSelector} onCancel={() => setShowAddressSelector(false)} onSelect={handleAddressSelected} />
            <AddressFormModal show={showAddressForm} onCancel={() => setShowAddressForm(false)} onSave={handleNewAddressSaved} />
        </>
    );
}