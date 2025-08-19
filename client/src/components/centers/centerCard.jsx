import React from 'react';
import { Card, Dropdown, ButtonGroup, Button, Col } from 'react-bootstrap';

export default function CenterCard({ center, onEdit, onDelete }) {
    const formatAddress = (addr) => addr ? `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}` : 'No address on file';

    return (
        <Col>
            <Card>
                <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                        {center.name}
                        <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${center.center_id}`}>
                                Details
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Header>Contact Info</Dropdown.Header>
                                <Dropdown.ItemText>📧 {center.contact_email || 'N/A'}</Dropdown.ItemText>
                                <Dropdown.ItemText>📞 {center.contact_phone || 'N/A'}</Dropdown.ItemText>
                                <Dropdown.Divider />
                                <Dropdown.Header>Address</Dropdown.Header>
                                <Dropdown.ItemText>{formatAddress(center.address)}</Dropdown.ItemText>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{center.type}</Card.Subtitle>
                    <ButtonGroup size="sm">
                        <Button variant="outline-secondary" onClick={() => onEdit(center)}>Edit</Button>
                        <Button variant="outline-danger" onClick={() => onDelete(center.center_id)}>Delete</Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </Col>
    );
}