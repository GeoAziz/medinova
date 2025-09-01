# MediNova API Documentation

## Overview

This document provides comprehensive documentation for the MediNova API, including authentication, endpoints, and data models.

## Authentication

All API requests must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Base URL

```
https://api.medinova.com/v1
```

## Endpoints

### Patient Management

#### GET /patients/{id}

Retrieve patient information.

**Parameters:**
- `id` (path): Patient ID

**Response:**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "string",
  "medicalHistory": [...],
  "appointments": [...]
}
```

#### POST /patients

Create a new patient record.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  }
}
```

### Appointments

#### GET /appointments

List appointments with optional filtering.

**Query Parameters:**
- `doctorId` (optional): Filter by doctor
- `date` (optional): Filter by date
- `status` (optional): Filter by status

#### POST /appointments

Schedule a new appointment.

**Request Body:**
```json
{
  "patientId": "string",
  "doctorId": "string",
  "dateTime": "string",
  "type": "in-person|video",
  "notes": "string"
}
```

### Telemedicine

#### POST /telemedicine/sessions

Create a new telemedicine session.

**Request Body:**
```json
{
  "appointmentId": "string",
  "doctorId": "string",
  "patientId": "string"
}
```

### Billing

#### POST /billing/charges

Create a new billing charge.

**Request Body:**
```json
{
  "patientId": "string",
  "amount": number,
  "description": "string",
  "insurance": {
    "provider": "string",
    "policyNumber": "string"
  }
}
```

## Error Responses

All endpoints may return the following errors:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Common error codes:
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for regular endpoints
- 30 requests per minute for heavy operations
- 1000 requests per day per API key

## Webhooks

MediNova can send webhooks for various events:

- Appointment updates
- Billing events
- Patient record changes
- Telemedicine session status changes

Configure webhook endpoints in the developer dashboard.
