import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { Form, Button, Row, Col } from "react-bootstrap";
import { formatDate, formatToDatetimeLocal } from "../../utils/formatDate";

export default function EventForm({ event, onSuccess }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    nama_acara: "",
    deskripsi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    lokasi: "",
    status_acara: "scheduled",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (event) {
      console.log("Editing event:", event);
      setFormData({
        nama_acara: event.nama_acara,
        deskripsi: event.deskripsi || "",
        tanggal_mulai: event.tanggal_mulai ? formatToDatetimeLocal(event.tanggal_mulai) : "",
        tanggal_selesai: event.tanggal_selesai ? formatToDatetimeLocal(event.tanggal_selesai) : "",
        lokasi: event.lokasi,
        status_acara: event.status_acara,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // In EventForm.jsx, update the mutation functions
  const createEvent = useMutation({
    mutationFn: (data) => api.post("/acara", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      onSuccess();
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      alert("Error creating event: " + (error.response?.data?.message || error.message));
    },
  });

  const updateEvent = useMutation({
    mutationFn: (data) => api.put(`/acara/${event.id_acara}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      onSuccess();
    },
    onError: (error) => {
      console.error("Error updating event:", error);
      alert("Error updating event: " + (error.response?.data?.message || error.message));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format datetime for API
    const formattedData = {
      ...formData,
      created_by: currentUser.id, // Add current user ID
      tanggal_mulai: formatDate(formData.tanggal_mulai, "YYYY-MM-DD HH:mm:ss"),
      tanggal_selesai: formatDate(formData.tanggal_selesai, "YYYY-MM-DD HH:mm:ss"),
    };

    if (event) {
      updateEvent.mutate(formattedData);
    } else {
      createEvent.mutate(formattedData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nama Acara</Form.Label>
            <Form.Control type="text" name="nama_acara" value={formData.nama_acara} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Status Acara</Form.Label>
            <Form.Select name="status_acara" value={formData.status_acara} onChange={handleChange}>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Deskripsi</Form.Label>
        <Form.Control as="textarea" name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3} />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tanggal Mulai</Form.Label>
            <Form.Control
              type="datetime-local"
              name="tanggal_mulai"
              value={formData.tanggal_mulai}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tanggal Selesai</Form.Label>
            <Form.Control
              type="datetime-local"
              name="tanggal_selesai"
              value={formData.tanggal_selesai}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Lokasi</Form.Label>
        <Form.Control type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} required />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={onSuccess}>
          Batal
        </Button>
        <Button type="submit">{event ? "Update" : "Simpan"}</Button>
      </div>
    </Form>
  );
}
