import React from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';

export default function VolunteerDetailsModal({ show, volunteer, onCancel }) {
    if (!volunteer) return null;
    const formatAddress = (addr) => addr ? `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country} ${addr.zip}` : 'N/A';

    //transform status_id and type_id to readable format
    let stat, type;
    switch(volunteer.status_id) {
        case 1: stat = 'Pending Approval'; break;
        case 2: stat = 'Approved'; break;   
        case 3: stat = 'Rejected'; break;
        case 4: stat = 'Active'; break;
        case 5: stat = 'Inactive'; break;
        default: stat = 'Unknown';
    }

    switch(volunteer.type_id) {
        case 1: type = 'Volunteer'; break;
        case 2: type = 'Admin'; break;
        default: type = 'Infiltrator';
    }
    return (
        <Modal show={show} onHide={onCancel} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{volunteer.first_name} {volunteer.last_name}'s Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item><strong>Username:</strong> {volunteer.username}</ListGroup.Item>
                    <ListGroup.Item><strong>Email:</strong> {volunteer.email}</ListGroup.Item>
                    <ListGroup.Item><strong>Status:</strong> {stat} </ListGroup.Item>
                    <ListGroup.Item><strong>Type:</strong> {type}</ListGroup.Item>
                    <ListGroup.Item><strong>Address:</strong> {formatAddress(volunteer.address)}</ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Skills:</strong>
                        {volunteer.skills?.length > 0
                            ? volunteer.skills.map(skill => <Badge key={skill.skill_id} pill bg="info" className="ms-1">{skill.name}</Badge>)
                            : ' No skills listed'
                        }
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}