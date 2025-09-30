import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import AttendanceList from "../components/attendance/AttendanceList";
import AttendanceForm from "../components/attendance/AttendanceForm";
import { Button, Modal, Form, Card, Row, Col, Badge } from "react-bootstrap";

function fetchEvents() {
  return api.get("/acara").then((res) => res.data);
}

function fetchAttendance(eventId) {
  return api.get(`/absensi/acara/${eventId}`).then((res) => res.data);
}

export default function AttendancePage() {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const queryClient = useQueryClient();

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const {
    data: attendance,
    isLoading: attendanceLoading,
    isError: attendanceError,
  } = useQuery({
    queryKey: ["attendance", selectedEventId],
    queryFn: () => fetchAttendance(selectedEventId),
    enabled: !!selectedEventId,
  });

  const deleteAttendance = useMutation({
    mutationFn: (id) => api.delete(`/absensi/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance", selectedEventId]);
    },
  });

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);

    // Find the full event object
    const event = events?.find((ev) => ev.id_acara == eventId);
    setSelectedEvent(event || null);
  };

  const handleEdit = (attendance) => {
    setEditingAttendance(attendance);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus absensi ini?")) {
      deleteAttendance.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAttendance(null);
  };

  return (
    <div>
      <h1 className="mb-4">Absensi</h1>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Pilih Acara</Card.Title>
          <Form.Select value={selectedEventId} onChange={handleEventChange}>
            <option value="">-- Pilih Acara --</option>
            {events?.map((event) => (
              <option key={event.id_acara} value={event.id_acara}>
                {event.nama_acara} - {new Date(event.tanggal_mulai).toLocaleDateString()}
              </option>
            ))}
          </Form.Select>
        </Card.Body>
      </Card>

      {selectedEvent && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>{selectedEvent.nama_acara}</span>
                <Badge
                  bg={
                    selectedEvent.status_acara === "scheduled"
                      ? "primary"
                      : selectedEvent.status_acara === "ongoing"
                      ? "warning"
                      : selectedEvent.status_acara === "completed"
                      ? "success"
                      : "danger"
                  }
                >
                  {selectedEvent.status_acara}
                </Badge>
              </Card.Title>
              <Card.Text>
                {new Date(selectedEvent.tanggal_mulai).toLocaleString()} -{" "}
                {new Date(selectedEvent.tanggal_selesai).toLocaleString()}
              </Card.Text>
              <Card.Text>
                <strong>Lokasi:</strong> {selectedEvent.lokasi}
              </Card.Text>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Daftar Absensi</h4>
            <Button onClick={() => setShowForm(true)}>
              <span className="me-2">+</span> Tambah Absensi
            </Button>
          </div>

          {attendanceLoading ? (
            <div className="text-center py-5">Loading attendance...</div>
          ) : attendanceError ? (
            <div className="alert alert-danger">Error loading attendance data</div>
          ) : (
            <AttendanceList attendance={attendance || []} onEdit={handleEdit} onDelete={handleDelete} />
          )}

          <Modal show={showForm} onHide={handleFormClose} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>{editingAttendance ? "Edit Absensi" : "Tambah Absensi"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AttendanceForm eventId={selectedEventId} attendance={editingAttendance} onSuccess={handleFormClose} />
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
}
