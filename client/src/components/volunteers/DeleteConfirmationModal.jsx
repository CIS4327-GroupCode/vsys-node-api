import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

export default function DeleteConfirmationModal({ show, onCancel, onSoftDelete, onHardDelete }) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="warning">
                    <Alert.Heading>Are you sure you want to delete this user?</Alert.Heading>
                    <p>You have two options:</p>
                    <ul>
                        <li><strong>Deactivate (Soft Delete):</strong> The user's account will be marked as inactive and hidden, but their data will be preserved.</li>
                        <li><strong>Delete Permanently (Hard Delete):</strong> All data for this user will be permanently erased. This action cannot be undone.</li>
                    </ul>
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button variant="warning" onClick={onSoftDelete}>Deactivate (Soft Delete)</Button>
                <Button variant="danger" onClick={onHardDelete}>Delete Permanently</Button>
            </Modal.Footer>
        </Modal>
    );
}