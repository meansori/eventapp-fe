import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { Form, Button, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";

function fetchParticipants() {
  return api.get("/peserta").then((res) => res.data);
}

export default function AttendanceForm({ eventId, attendance, onSuccess }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    id_peserta: "",
    status_kehadiran: "Hadir",
  });
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newParticipant, setNewParticipant] = useState({
    nama_peserta: "",
    asal: "",
    kategori: "",
  });
  const [showNewParticipant, setShowNewParticipant] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    fetchParticipants().then((data) => {
      setParticipants(data);
      setFilteredParticipants(data);
    });
  }, []);

  useEffect(() => {
    if (attendance) {
      setFormData({
        id_peserta: attendance.id_peserta,
        status_kehadiran: attendance.status_kehadiran,
      });
    }
  }, [attendance]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredParticipants(participants);
    } else {
      const filtered = participants.filter(
        (p) =>
          p.nama_peserta.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.asal && p.asal.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.kategori && p.kategori.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredParticipants(filtered);
    }
  }, [searchTerm, participants]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNewParticipantChange = (e) => {
    const { name, value } = e.target;
    setNewParticipant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createAttendance = useMutation({
    mutationFn: (data) => api.post("/absensi", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance", eventId]);
      onSuccess();
    },
  });

  const updateAttendance = useMutation({
    mutationFn: (data) => api.put(`/absensi/${attendance.id_absensi}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance", eventId]);
      onSuccess();
    },
  });

  const addNewParticipant = useMutation({
    mutationFn: (data) => api.post("/peserta", data),
    onSuccess: (response) => {
      const newId = response.data.pesertaId;
      setFormData((prev) => ({
        ...prev,
        id_peserta: newId,
      }));
      const newParticipantData = { id_peserta: newId, ...newParticipant };
      setParticipants((prev) => [...prev, newParticipantData]);
      setFilteredParticipants((prev) => [...prev, newParticipantData]);
      setShowNewParticipant(false);
      setNewParticipant({
        nama_peserta: "",
        asal: "",
        kategori: "",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id_acara: eventId,
      ...formData,
    };
    if (attendance) {
      updateAttendance.mutate(data);
    } else {
      createAttendance.mutate(data);
    }
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();
    addNewParticipant.mutate(newParticipant);
  };

  const handleStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      status_kehadiran: status,
    }));
  };

  const statusOptions = [
    { value: "Hadir", label: "Hadir", color: "success" },
    { value: "Terlambat", label: "Terlambat", color: "warning" },
    { value: "Izin", label: "Izin", color: "info" },
    { value: "Sakit", label: "Sakit", color: "secondary" },
    { value: "Alfa", label: "Alfa", color: "danger" },
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Peserta</Form.Label>
        <InputGroup className="mb-2">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl placeholder="Cari peserta..." value={searchTerm} onChange={handleSearchChange} />
        </InputGroup>
        <Form.Select name="id_peserta" value={formData.id_peserta} onChange={handleChange} required>
          <option value="">-- Pilih Peserta --</option>
          {filteredParticipants.map((p) => (
            <option key={p.id_peserta} value={p.id_peserta}>
              {p.nama_peserta} {p.asal ? `(${p.asal})` : ""} {p.kategori ? `[${p.kategori}]` : ""}
            </option>
          ))}
        </Form.Select>
        <Button variant="link" className="p-0 mt-1" onClick={() => setShowNewParticipant(!showNewParticipant)}>
          {showNewParticipant ? (
            "Batal"
          ) : (
            <>
              <FaPlus className="me-1" /> Tambah Peserta Baru
            </>
          )}
        </Button>
      </Form.Group>

      {showNewParticipant && (
        <div className="mb-4 p-3 border rounded">
          <h5 className="mb-3">Tambah Peserta Baru</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Peserta</Form.Label>
                <Form.Control
                  type="text"
                  name="nama_peserta"
                  value={newParticipant.nama_peserta}
                  onChange={handleNewParticipantChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Asal</Form.Label>
                <Form.Control
                  type="text"
                  name="asal"
                  value={newParticipant.asal}
                  onChange={handleNewParticipantChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Kategori</Form.Label>
            <Form.Control
              type="text"
              name="kategori"
              value={newParticipant.kategori}
              onChange={handleNewParticipantChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddParticipant}>
            Simpan Peserta
          </Button>
        </div>
      )}

      <Form.Group className="mb-4">
        <Form.Label>Status Kehadiran</Form.Label>
        <div className="status-checkboxes">
          {statusOptions.map((option) => (
            <div
              key={option.value}
              className={`status-checkbox ${formData.status_kehadiran === option.value ? "selected" : ""} bg-${
                option.color
              } bg-opacity-10`}
              onClick={() => handleStatusChange(option.value)}
            >
              <Form.Check
                type="checkbox"
                id={`status-${option.value}`}
                checked={formData.status_kehadiran === option.value}
                onChange={() => {}}
                className="me-2"
              />
              <span className={`text-${option.color} fw-bold`}>{option.label}</span>
            </div>
          ))}
        </div>
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={onSuccess}>
          Batal
        </Button>
        <Button type="submit">{attendance ? "Update" : "Simpan"}</Button>
      </div>
    </Form>
  );
}
