import React from 'react';
import { Card, ButtonGroup, Button, Col } from 'react-bootstrap';

export default function VolunteerCard({ volunteer, onEdit, onDelete, onShowDetails }) {
    const fullName = `${volunteer.first_name} ${volunteer.last_name}`;
    return (
        <Col>
            <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                    <Card.Title>{fullName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{volunteer.username}</Card.Subtitle>
                    <div className="mt-auto">
                        <ButtonGroup size="sm" className="w-100">
                            <Button variant="outline-primary" onClick={() => onShowDetails(volunteer)}>View Details</Button>
                            <Button variant="outline-secondary" onClick={() => onEdit(volunteer)}>Edit</Button>
                            <Button variant="outline-danger" onClick={() => onDelete(volunteer)}>Delete</Button>
                        </ButtonGroup>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
}