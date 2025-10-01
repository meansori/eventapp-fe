import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import EventList from "../components/events/EventList";
import EventForm from "../components/events/EventForm";
import EventDetail from "../components/events/EventDetail";
import { Button, Modal } from "react-bootstrap";

function fetchEvents() {
  return api.get("/acara").then((res) => res.data);
}

function fetchEventStatistics(eventId) {
  return api.get(`/absensi/statistics/acara/${eventId}`).then((res) => res.data);
}

export default function EventsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const deleteEvent = useMutation({
    mutationFn: (id) => api.delete(`/acara/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      setSelectedEvent(null);
    },
  });

  const handleViewDetail = async (event) => {
    console.log("Viewing details for event:", event);

    setSelectedEvent(event);
    try {
      const stats = await fetchEventStatistics(event.id_acara);
      setStatistics(stats);
      setShowDetail(true);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics([]);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus acara ini?")) {
      deleteEvent.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Master Event</h1>
        <Button onClick={() => setShowForm(true)}>
          <span className="me-2">+</span> Tambah Event
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-5">Loading events...</div>
      ) : isError ? (
        <div className="alert alert-danger">Error loading events</div>
      ) : (
        <EventList events={events} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleViewDetail} />
      )}

      {/* Modal untuk detail acara */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detail Acara</Modal.Title>
        </Modal.Header>
        <Modal.Body>{selectedEvent && <EventDetail event={selectedEvent} statistics={statistics} />}</Modal.Body>
      </Modal>

      {/* Modal untuk form tambah/edit event */}
      <Modal show={showForm} onHide={handleFormClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingEvent ? "Edit Event" : "Tambah Event"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm event={editingEvent} onSuccess={handleFormClose} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
