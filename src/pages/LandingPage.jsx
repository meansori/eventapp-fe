import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaSignInAlt } from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <Container>
          <a className="navbar-brand d-flex align-items-center" href="#">
            <div className="logo-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
              <FaCalendarAlt />
            </div>
            <span className="fw-bold">EventManager</span>
          </a>
          <Button variant="primary" onClick={() => navigate("/login")}>
            <FaSignInAlt className="me-2" /> Sign In
          </Button>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="hero-section flex-grow-1 d-flex align-items-center">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">Kelola Acara dan Absensi dengan Mudah</h1>
              <p className="lead mb-5">
                Platform lengkap untuk mengelola jadwal acara, peserta, dan pencatatan kehadiran dalam satu aplikasi.
              </p>
              <Button variant="primary" size="lg" onClick={() => navigate("/login")}>
                Mulai Sekarang
              </Button>
            </Col>
            <Col lg={6}>
              <div className="hero-image text-center">
                <div className="illustration">
                  <div className="illustration-item illustration-item-1">
                    <FaCalendarAlt size={60} className="text-primary" />
                  </div>
                  <div className="illustration-item illustration-item-2">
                    <FaCalendarAlt size={60} className="text-success" />
                  </div>
                  <div className="illustration-item illustration-item-3">
                    <FaCalendarAlt size={60} className="text-warning" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={6}>
              <p>&copy; 2023 EventManager. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p>Designed with ❤️ for event organizers</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}
