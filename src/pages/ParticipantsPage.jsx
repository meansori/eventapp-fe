import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import ParticipantList from "../components/participants/ParticipantList";
import ParticipantForm from "../components/participants/ParticipantForm";
import { Button, Modal, Form } from "react-bootstrap";
import { FaFileImport, FaChartBar, FaPlus } from "react-icons/fa";

function fetchParticipants() {
  return api.get("/peserta").then((res) => res.data);
}

export default function ParticipantsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const {
    data: participants,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["participants"],
    queryFn: fetchParticipants,
  });

  const deleteParticipant = useMutation({
    mutationFn: (id) => api.delete(`/peserta/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["participants"]);
    },
  });

  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus peserta ini?")) {
      deleteParticipant.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingParticipant(null);
  };

  const filteredParticipants =
    participants?.filter(
      (p) =>
        p.nama_peserta.toLowerCase().includes(search.toLowerCase()) ||
        (p.asal && p.asal.toLowerCase().includes(search.toLowerCase())) ||
        (p.kategori && p.kategori.toLowerCase().includes(search.toLowerCase())) ||
        (p.jenis_kelamin && p.jenis_kelamin.toLowerCase().includes(search.toLowerCase())) ||
        (p.agama && p.agama.toLowerCase().includes(search.toLowerCase()))
    ) || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Master Peserta</h1>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => (window.location.href = "/import-participants")}>
            <FaFileImport className="me-2" /> Import
          </Button>
          <Button variant="outline-primary" onClick={() => (window.location.href = "/participant-report")}>
            <FaChartBar className="me-2" /> Laporan
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <FaPlus className="me-2" /> Tambah Peserta
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Form.Control type="text" placeholder="Cari peserta..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="text-center py-5">Loading participants...</div>
      ) : isError ? (
        <div className="alert alert-danger">Error loading participants</div>
      ) : (
        <ParticipantList participants={filteredParticipants} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Modal show={showForm} onHide={handleFormClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingParticipant ? "Edit Peserta" : "Tambah Peserta"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ParticipantForm participant={editingParticipant} onSuccess={handleFormClose} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
