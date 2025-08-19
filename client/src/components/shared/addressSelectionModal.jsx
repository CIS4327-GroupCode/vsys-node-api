import React, { useState, useEffect } from 'react';
import { Modal, Spinner, ListGroup } from 'react-bootstrap';

export default function AddressSelectionModal({ show, onCancel, onSelect }) {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (show) {
            setIsLoading(true);
            // Fetches all addresses
            fetch('http://localhost:3000/api/address')
                .then(res => res.json())
                .then(setAddresses)
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [show]);

    const formatAddress = (addr) => `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`;

    return (
        <Modal show={show} onHide={onCancel} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Select an Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? <Spinner animation="border" /> : (
                    <ListGroup>
                        {addresses.map(addr => (
                            <ListGroup.Item action key={addr.address_id} onClick={() => onSelect(addr)}>
                                {formatAddress(addr)}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
        </Modal>
    );
}