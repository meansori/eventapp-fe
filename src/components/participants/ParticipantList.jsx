import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

export default function ParticipantList({ participants, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nama Peserta</th>
            <th>Asal</th>
            <th>Kategori</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {participants.length > 0 ? (
            participants.map((participant) => (
              <tr key={participant.id_peserta}>
                <td className="fw-bold">{participant.nama_peserta}</td>
                <td>{participant.asal || "-"}</td>
                <td>{participant.kategori ? <Badge bg="secondary">{participant.kategori}</Badge> : "-"}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(participant)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => onDelete(participant.id_peserta)}>
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-3 text-muted">
                Tidak ada peserta ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
