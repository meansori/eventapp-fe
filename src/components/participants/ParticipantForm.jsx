import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function ParticipantForm({ participant, onSuccess }) {
  const [formData, setFormData] = useState({
    nama_peserta: "",
    asal: "",
    kategori: "",
    jenis_kelamin: "",
    agama: "",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (participant) {
      setFormData({
        nama_peserta: participant.nama_peserta,
        asal: participant.asal || "",
        kategori: participant.kategori || "",
        jenis_kelamin: participant.jenis_kelamin || "",
        agama: participant.agama || "",
      });
    }
  }, [participant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createParticipant = useMutation({
    mutationFn: (data) => api.post("/peserta", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["participants"]);
      onSuccess();
    },
  });

  const updateParticipant = useMutation({
    mutationFn: (data) => api.put(`/peserta/${participant.id_peserta}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["participants"]);
      onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (participant) {
      updateParticipant.mutate(formData);
    } else {
      createParticipant.mutate(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nama Peserta</Form.Label>
        <Form.Control type="text" name="nama_peserta" value={formData.nama_peserta} onChange={handleChange} required />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Jenis Kelamin</Form.Label>
            <Form.Select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange}>
              <option value="">-- Pilih Jenis Kelamin --</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Agama</Form.Label>
            <Form.Select name="agama" value={formData.agama} onChange={handleChange}>
              <option value="">-- Pilih Agama --</option>
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
              <option value="Lainnya">Lainnya</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Asal</Form.Label>
            <Form.Control type="text" name="asal" value={formData.asal} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label>Kategori</Form.Label>
            <Form.Control type="text" name="kategori" value={formData.kategori} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={onSuccess}>
          Batal
        </Button>
        <Button type="submit">{participant ? "Update" : "Simpan"}</Button>
      </div>
    </Form>
  );
}
