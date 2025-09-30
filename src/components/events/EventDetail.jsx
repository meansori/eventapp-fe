import React from "react";
import { Card, Row, Col, Badge, Table } from "react-bootstrap";
import formatDate from "../../utils/formatDate";

export default function EventDetail({ event, statistics }) {
  return (
    <Card>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h6 className="text-muted">Informasi Acara</h6>
            <Table borderless>
              <tbody>
                <tr>
                  <td className="fw-bold">Nama Acara</td>
                  <td>{event.nama_acara}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Deskripsi</td>
                  <td>{event.deskripsi || "-"}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Tanggal Mulai</td>
                  <td>{formatDate(event.tanggal_mulai, "DD MMM YYYY HH:mm")}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Tanggal Selesai</td>
                  <td>{formatDate(event.tanggal_selesai, "DD MMM YYYY HH:mm")}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Lokasi</td>
                  <td>{event.lokasi}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Status</td>
                  <td>
                    <Badge className={`status-badge status-${event.status_acara.toLowerCase()}`}>
                      {event.status_acara}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <h6 className="text-muted">Statistik Kehadiran</h6>
            {statistics.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.map((stat, index) => (
                    <tr key={index}>
                      <td>
                        <Badge
                          bg={
                            stat.status_kehadiran === "Hadir"
                              ? "success"
                              : stat.status_kehadiran === "Terlambat"
                              ? "warning"
                              : stat.status_kehadiran === "Izin"
                              ? "info"
                              : stat.status_kehadiran === "Sakit"
                              ? "secondary"
                              : "danger"
                          }
                        >
                          {stat.status_kehadiran}
                        </Badge>
                      </td>
                      <td>{stat.jumlah}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-muted">Belum ada data kehadiran</p>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
