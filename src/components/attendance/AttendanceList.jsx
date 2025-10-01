import { Table, Button, Badge, Card, Row, Col } from "react-bootstrap";
import { formatDate } from "../../utils/formatDate";

function calculateStatistics(attendanceData) {
  if (!attendanceData || attendanceData.length === 0) {
    return {
      hadir: 0,
      terlambat: 0,
      izin: 0,
      sakit: 0,
      alfa: 0,
      total: 0,
    };
  }

  const stats = {
    hadir: 0,
    terlambat: 0,
    izin: 0,
    sakit: 0,
    alfa: 0,
    total: attendanceData.length,
  };

  attendanceData.forEach((att) => {
    switch (att.status_kehadiran) {
      case "Hadir":
        stats.hadir++;
        break;
      case "Terlambat":
        stats.terlambat++;
        break;
      case "Izin":
        stats.izin++;
        break;
      case "Sakit":
        stats.sakit++;
        break;
      case "Alfa":
        stats.alfa++;
        break;
    }
  });

  return stats;
}

export default function AttendanceList({ attendance, onEdit, onDelete }) {
  const stats = calculateStatistics(attendance);

  return (
    <>
      {attendance && attendance.length > 0 && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Statistik Kehadiran</Card.Title>
            <Row>
              <Col xs={6} md={2} className="text-center mb-3">
                <div className="p-3 bg-success bg-opacity-10 rounded">
                  <div className="h4 text-success">
                    {stats.hadir}/{stats.total}
                  </div>
                  <div className="small">Hadir</div>
                </div>
              </Col>
              <Col xs={6} md={2} className="text-center mb-3">
                <div className="p-3 bg-warning bg-opacity-10 rounded">
                  <div className="h4 text-warning">
                    {stats.terlambat}/{stats.total}
                  </div>
                  <div className="small">Terlambat</div>
                </div>
              </Col>
              <Col xs={6} md={2} className="text-center mb-3">
                <div className="p-3 bg-info bg-opacity-10 rounded">
                  <div className="h4 text-info">
                    {stats.izin}/{stats.total}
                  </div>
                  <div className="small">Izin</div>
                </div>
              </Col>
              <Col xs={6} md={2} className="text-center mb-3">
                <div className="p-3 bg-secondary bg-opacity-10 rounded">
                  <div className="h4 text-secondary">
                    {stats.sakit}/{stats.total}
                  </div>
                  <div className="small">Sakit</div>
                </div>
              </Col>
              <Col xs={6} md={2} className="text-center mb-3">
                <div className="p-3 bg-danger bg-opacity-10 rounded">
                  <div className="h4 text-danger">
                    {stats.alfa}/{stats.total}
                  </div>
                  <div className="small">Alfa</div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nama Peserta</th>
              <th>Asal</th>
              <th>Status</th>
              <th>Waktu Absen</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {attendance?.length > 0 ? (
              attendance.map((att) => (
                <tr key={att.id_absensi}>
                  <td>{att.nama_peserta}</td>
                  <td>{att.asal || "-"}</td>
                  <td>
                    <Badge
                      bg={
                        att.status_kehadiran === "Hadir"
                          ? "success"
                          : att.status_kehadiran === "Terlambat"
                          ? "warning"
                          : att.status_kehadiran === "Izin"
                          ? "info"
                          : att.status_kehadiran === "Sakit"
                          ? "secondary"
                          : "danger"
                      }
                    >
                      {att.status_kehadiran}
                    </Badge>
                  </td>
                  <td>{formatDate(att.waktu_absen, "DD MM YYYY HH:mm:ss")}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(att)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => onDelete(att.id_absensi)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-3 text-muted">
                  Belum ada data absensi untuk acara ini
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}
