import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { Form, Button, Row, Col, InputGroup, FormControl, Card, ListGroup, Badge } from "react-bootstrap";
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
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

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
      // Find the participant name for display
      const participant = participants.find((p) => p.id_peserta === attendance.id_peserta);
      if (participant) {
        setSearchTerm(participant.nama_peserta);
      }
    }
  }, [attendance, participants]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredParticipants(participants);
      setShowSearchResults(false);
    } else {
      const filtered = participants.filter(
        (p) =>
          p.nama_peserta.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.asal && p.asal.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.kategori && p.kategori.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredParticipants(filtered);
      setShowSearchResults(true);
    }
  }, [searchTerm, participants]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Clear selected participant when searching
    setFormData((prev) => ({ ...prev, id_peserta: "" }));
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
      setSearchTerm(newParticipant.nama_peserta);
      setShowSearchResults(false);
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
    if (!formData.id_peserta) {
      alert("Silakan pilih peserta terlebih dahulu");
      return;
    }
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
    if (!newParticipant.nama_peserta) {
      alert("Nama peserta harus diisi");
      return;
    }
    addNewParticipant.mutate(newParticipant);
  };

  const handleSelectParticipant = (participant) => {
    setFormData((prev) => ({
      ...prev,
      id_peserta: participant.id_peserta,
    }));
    setSearchTerm(participant.nama_peserta);
    setShowSearchResults(false);
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
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="mb-0">Peserta</Form.Label>
          <Button variant="outline-primary" size="sm" onClick={() => setShowNewParticipant(!showNewParticipant)}>
            <FaPlus className="me-1" /> Tambah Data
          </Button>
        </div>

        <div ref={searchRef} className="position-relative">
          <InputGroup>
            <FormControl placeholder="Cari peserta..." value={searchTerm} onChange={handleSearchChange} onFocus={() => searchTerm && setShowSearchResults(true)} />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>

          {showSearchResults && filteredParticipants.length > 0 && (
            <Card className="position-absolute w-100 mt-1 z-index-10" style={{ zIndex: 10 }}>
              <ListGroup variant="flush" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {filteredParticipants.map((p) => (
                  <ListGroup.Item key={p.id_peserta} action onClick={() => handleSelectParticipant(p)} className="py-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">{p.nama_peserta}</div>
                        {p.asal && <div className="small text-muted">{p.asal}</div>}
                        {p.kategori && <div className="small text-muted">[{p.kategori}]</div>}
                      </div>
                      <div className="text-end">
                        {p.jenis_kelamin && (
                          <Badge bg={p.jenis_kelamin === "Laki-laki" ? "primary" : "danger"} className="me-1">
                            {p.jenis_kelamin}
                          </Badge>
                        )}
                        {p.agama && <Badge bg="info">{p.agama}</Badge>}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}

          {showSearchResults && filteredParticipants.length === 0 && (
            <Card className="position-absolute w-100 mt-1 z-index-10" style={{ zIndex: 10 }}>
              <Card.Body className="text-center py-2">Tidak ada peserta ditemukan</Card.Body>
            </Card>
          )}
        </div>
      </Form.Group>

      {showNewParticipant && (
        <div className="mb-4 p-3 border rounded">
          <h5 className="mb-3">Tambah Peserta Baru</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Peserta</Form.Label>
                <Form.Control type="text" name="nama_peserta" value={newParticipant.nama_peserta} onChange={handleNewParticipantChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Asal</Form.Label>
                <Form.Control type="text" name="asal" value={newParticipant.asal} onChange={handleNewParticipantChange} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Kategori</Form.Label>
            <Form.Control type="text" name="kategori" value={newParticipant.kategori} onChange={handleNewParticipantChange} />
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
              className={`status-checkbox ${formData.status_kehadiran === option.value ? "selected" : ""} bg-${option.color} bg-opacity-10`}
              onClick={() => handleStatusChange(option.value)}
            >
              <Form.Check type="checkbox" id={`status-${option.value}`} checked={formData.status_kehadiran === option.value} onChange={() => {}} className="me-2" />
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
