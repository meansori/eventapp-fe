import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Badge, ButtonGroup } from "react-bootstrap";
import { useAuthenticatedQuery } from "../../hooks/useAuthenticatedQuery";
import api from "../../services/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const localizer = momentLocalizer(moment);

function fetchEventsByMonth(year, month) {
  return api.get(`/acara/month/${year}/${month}`).then((res) => res.data);
}

// ... kode sebelumnya tetap sama ...

export default function MonthlyCalendar({ currentMonth, onMonthChange }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const year = moment(currentMonth).year();
  const month = moment(currentMonth).month() + 1; // moment months are 0-indexed

  const { data: apiEvents, isLoading } = useAuthenticatedQuery(["calendarEvents", year, month], () => fetchEventsByMonth(year, month));

  useEffect(() => {
    if (apiEvents) {
      const formattedEvents = apiEvents.map((event) => ({
        id: event.id_acara,
        title: event.nama_acara,
        start: new Date(event.tanggal_mulai),
        end: new Date(event.tanggal_selesai),
        allDay: false,
        resource: event,
      }));
      setEvents(formattedEvents);
    }
  }, [apiEvents]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setShowModal(true);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#4361ee"; // Default color

    if (event.resource.status_acara === "scheduled") {
      backgroundColor = "#4361ee";
    } else if (event.resource.status_acara === "ongoing") {
      backgroundColor = "#f72585";
    } else if (event.resource.status_acara === "completed") {
      backgroundColor = "#4cc9f0";
    } else if (event.resource.status_acara === "canceled") {
      backgroundColor = "#6c757d";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        color: "white",
        border: "none",
      },
    };
  };

  const navigateToPreviousMonth = () => {
    const newMonth = moment(currentMonth).subtract(1, "month");
    onMonthChange(newMonth.toDate());
  };

  const navigateToNextMonth = () => {
    const newMonth = moment(currentMonth).add(1, "month");
    onMonthChange(newMonth.toDate());
  };

  const navigateToToday = () => {
    onMonthChange(new Date());
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
      navigateToPreviousMonth();
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
      navigateToNextMonth();
    };

    const goToCurrent = () => {
      toolbar.onNavigate("TODAY");
      navigateToToday();
    };

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={goToBack}>
            <FaChevronLeft />
          </button>
          <button type="button" onClick={goToCurrent}>
            Today
          </button>
          <button type="button" onClick={goToNext}>
            <FaChevronRight />
          </button>
        </span>
        <span className="rbc-toolbar-label">{toolbar.label}</span>
        <span className="rbc-btn-group">{toolbar.viewNamesGroup}</span>
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center py-5">Loading calendar...</div>;
  }

  return (
    <>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={["month"]}
          popup
          date={currentMonth}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detail Acara</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <h5>{selectedEvent.nama_acara}</h5>
              <p>
                <strong>Deskripsi:</strong> {selectedEvent.deskripsi || "-"}
              </p>
              <p>
                <strong>Tanggal:</strong> {moment(selectedEvent.tanggal_mulai).format("DD MMM YYYY HH:mm")} - {moment(selectedEvent.tanggal_selesai).format("DD MMM YYYY HH:mm")}
              </p>
              <p>
                <strong>Lokasi:</strong> {selectedEvent.lokasi}
              </p>
              <p>
                <strong>Status:</strong>
                <Badge className={`ms-2 status-badge status-${selectedEvent.status_acara.toLowerCase()}`}>{selectedEvent.status_acara}</Badge>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
