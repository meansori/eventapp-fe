import { Card, ListGroup, Badge } from "react-bootstrap";
import { formatDate } from "../../utils/formatDate";

export default function Calendar({ events }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title className="d-flex align-items-center">
          <span className="me-2">📅</span> Kalender Kegiatan Bulan Ini
        </Card.Title>

        <ListGroup variant="flush">
          {events.length > 0 ? (
            events.map((event) => (
              <ListGroup.Item key={event.id_acara} className="px-0">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold">{event.nama_acara}</div>
                    <div className="text-muted small">{formatDate(event.tanggal_mulai, "DD MMM YYYY")}</div>
                  </div>
                  <Badge className={`status-badge status-${event.status_acara.toLowerCase()}`}>
                    {event.status_acara}
                  </Badge>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <div className="text-center py-3 text-muted">Tidak ada acara bulan ini</div>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
