import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { useAuthenticatedQuery } from "../../hooks/useAuthenticatedQuery";
import api from "../../services/api";

function fetchEventsByMonth(year, month) {
  return api.get(`/acara/month/${year}/${month}`).then((res) => res.data);
}

export default function EventStatistics({ year, month }) {
  const { data: events, isLoading } = useAuthenticatedQuery(["eventStatistics", year, month], () => fetchEventsByMonth(year, month));

  if (isLoading) {
    return <div className="text-center py-3">Loading statistics...</div>;
  }

  const counts = {
    scheduled: 0,
    ongoing: 0,
    completed: 0,
    canceled: 0,
  };

  events?.forEach((event) => {
    counts[event.status_acara]++;
  });

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title className="d-flex align-items-center">
          <span className="me-2">📊</span> Statistik Event Bulan Ini
        </Card.Title>
        <Row>
          <Col xs={6} md={3} className="mb-3">
            <div className="text-center p-3 bg-primary bg-opacity-10 rounded">
              <div className="h4 text-primary">{counts.scheduled}</div>
              <div className="small">Scheduled</div>
            </div>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
              <div className="h4 text-warning">{counts.ongoing}</div>
              <div className="small">Ongoing</div>
            </div>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="text-center p-3 bg-success bg-opacity-10 rounded">
              <div className="h4 text-success">{counts.completed}</div>
              <div className="small">Completed</div>
            </div>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="text-center p-3 bg-danger bg-opacity-10 rounded">
              <div className="h4 text-danger">{counts.canceled}</div>
              <div className="small">Canceled</div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
