import React, { useState } from "react";
import * as XLSX from "xlsx";

import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import api from "../services/api";
import { Card, Table, Button, Badge, Form, Row, Col } from "react-bootstrap";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

function fetchParticipantAttendance(participantId) {
  return api.get(`/absensi/participant/${participantId}`).then((res) => res.data);
}

function fetchParticipants() {
  return api.get("/peserta").then((res) => res.data);
}

export default function ParticipantReport() {
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const { data: participants } = useAuthenticatedQuery(["participants"], fetchParticipants);

  const { data: attendanceData, isLoading } = useAuthenticatedQuery(["participantAttendance", selectedParticipant], () => fetchParticipantAttendance(selectedParticipant), {
    enabled: !!selectedParticipant,
  });

  const handleExportExcel = () => {
    // Implementasi export ke Excel
    if (!attendanceData || attendanceData.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    // Buat worksheet
    const ws = XLSX.utils.json_to_sheet(
      attendanceData.map((att) => ({
        "Nama Acara": att.nama_acara,
        Tanggal: new Date(att.tanggal_mulai).toLocaleDateString(),
        "Status Kehadiran": att.status_kehadiran,
        "Waktu Absensi": new Date(att.waktu_absen).toLocaleString(),
      }))
    );

    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Kehadiran");

    // Download file
    const participant = participants?.find((p) => p.id_peserta == selectedParticipant);
    const fileName = `laporan_kehadiran_${participant?.nama_peserta || "peserta"}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleExportPdf = () => {
    // Implementasi export ke PDF
    alert("Fitur export PDF akan segera tersedia");
  };

  return (
    <div>
      <h1 className="mb-4">Laporan Kehadiran Per Peserta</h1>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Pilih Peserta</Form.Label>
                <Form.Select value={selectedParticipant} onChange={(e) => setSelectedParticipant(e.target.value)}>
                  <option value="">-- Pilih Peserta --</option>
                  {participants?.map((p) => (
                    <option key={p.id_peserta} value={p.id_peserta}>
                      {p.nama_peserta}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <div className="d-flex gap-2">
                <Button variant="success" onClick={handleExportExcel} disabled={!selectedParticipant}>
                  <FaFileExcel className="me-2" /> Excel
                </Button>
                <Button variant="danger" onClick={handleExportPdf} disabled={!selectedParticipant}>
                  <FaFilePdf className="me-2" /> PDF
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {selectedParticipant && (
        <Card>
          <Card.Body>
            {isLoading ? (
              <div className="text-center py-5">Loading data...</div>
            ) : attendanceData && attendanceData.length > 0 ? (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Acara</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Waktu Absensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((att, index) => (
                      <tr key={att.id_absensi}>
                        <td>{index + 1}</td>
                        <td>{att.nama_acara}</td>
                        <td>{new Date(att.tanggal_mulai).toLocaleDateString()}</td>
                        <td>
                          <Badge
                            bg={
                              att.status_kehadiran === "Hadir"
                                ? "success"
                                : att.status_kehadiran === "Terlambat"
                                ? "warning"
                                : att.status_kehadiran === "Izin"
                                ? "info"
                                : att.status_kehadiran === "Sakit"
                                ? "secondary"
                                : "danger"
                            }
                          >
                            {att.status_kehadiran}
                          </Badge>
                        </td>
                        <td>{new Date(att.waktu_absen).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">Tidak ada data kehadiran untuk peserta ini</div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
