import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import formatDate from "../../utils/formatDate";

export default function EventList({ events, onEdit, onDelete, onViewDetail }) {
  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nama Acara</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id_acara}>
              <td className="fw-bold">{event.nama_acara}</td>
              <td>
                <Badge className={`status-badge status-${event.status_acara.toLowerCase()}`}>
                  {event.status_acara}
                </Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onViewDetail(event)}>
                  Detail
                </Button>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => onEdit(event)}>
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(event.id_acara)}>
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
