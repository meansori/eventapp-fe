import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaSignInAlt, FaUsers, FaChartBar, FaCheckCircle, FaRocket, FaMobileAlt } from "react-icons/fa";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      title: "Kelola Acara dengan Mudah",
      description: "Platform lengkap untuk mengelola jadwal acara, peserta, dan pencatatan kehadiran dalam satu aplikasi.",
      color: "#6366F1", // Indigo
    },
    {
      title: "Absensi Digital",
      description: "Catat kehadiran peserta dengan status lengkap dan real-time.",
      color: "#8B5CF6", // Violet
    },
    {
      title: "Laporan & Statistik",
      description: "Dapatkan insight dari data kehadiran dengan laporan yang komprehensif.",
      color: "#EC4899", // Pink
    },
  ];

  const features = [
    {
      icon: <FaCalendarAlt size={30} />,
      title: "Manajemen Acara",
      description: "Buat, edit, dan kelola jadwal acara dengan status yang dapat disesuaikan.",
    },
    {
      icon: <FaUsers size={30} />,
      title: "Master Peserta",
      description: "Kelola data peserta dengan informasi lengkap dan kategori yang dapat disesuaikan.",
    },
    {
      icon: <FaCheckCircle size={30} />,
      title: "Pencatatan Absensi",
      description: "Catat kehadiran peserta dengan status lengkap dan real-time.",
    },
    {
      icon: <FaChartBar size={30} />,
      title: "Statistik & Laporan",
      description: "Lihat statistik kehadiran dan ekspor laporan dalam format CSV atau PDF.",
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="hero-content">
                <h1 className="display-3 fw-bold mb-4 animate-fade-in">
                  Platform <span className="text-gradient">Manajemen Acara</span> Terpadu
                </h1>
                <p className="lead mb-5 animate-fade-in-delay">Kelola acara, peserta, dan absensi dalam satu platform. Mudah, cepat, dan efisien.</p>
                <div className="d-flex flex-wrap gap-3 animate-fade-in-delay-2">
                  <Button variant="primary" size="lg" onClick={() => navigate("/login")} className="btn-cta">
                    <FaSignInAlt className="me-2" /> Mulai Sekarang
                  </Button>
                  <Button variant="outline-light" size="lg" className="btn-outline">
                    Pelajari Lebih Lanjut
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-visual">
                <div className="illustration-container">
                  <div className="illustration-card card-1">
                    <Card className="h-100 border-0 shadow-lg">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="icon-circle bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                            <FaCalendarAlt />
                          </div>
                          <h5 className="mb-0">Acara Berlangsung</h5>
                        </div>
                        <p className="mb-0">Workshop React.js</p>
                        <small className="text-muted">Hari ini, 09:00 - 17:00</small>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="illustration-card card-2">
                    <Card className="h-100 border-0 shadow-lg">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="icon-circle bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3">
                            <FaCheckCircle />
                          </div>
                          <h5 className="mb-0">Kehadiran Hari Ini</h5>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div>
                            <p className="mb-0">Hadir</p>
                            <h4>24/30</h4>
                          </div>
                          <div>
                            <p className="mb-0">Terlambat</p>
                            <h4>4/30</h4>
                          </div>
                          <div>
                            <p className="mb-0">Izin</p>
                            <h4>2/30</h4>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="illustration-card card-3">
                    <Card className="h-100 border-0 shadow-lg">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="icon-circle bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center me-3">
                            <FaChartBar />
                          </div>
                          <h5 className="mb-0">Statistik Bulanan</h5>
                        </div>
                        <div className="progress mb-2" style={{ height: "8px" }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: "85%" }}></div>
                        </div>
                        <p className="mb-0">85% kehadiran rata-rata</p>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Fitur Unggulan</h2>
            <p className="lead text-muted">Semua yang Anda butuhkan untuk manajemen acara yang efektif</p>
          </div>
          <Row>
            {features.map((feature, index) => (
              <Col md={6} lg={3} className="mb-4" key={index}>
                <Card className="h-100 border-0 shadow-sm feature-card">
                  <Card.Body className="p-4 text-center">
                    <div className="icon-circle bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">{feature.icon}</div>
                    <h4 className="mb-3">{feature.title}</h4>
                    <p className="text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Apa Kata Mereka</h2>
            <p className="lead text-muted">Testimoni dari pengguna kami</p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-warning">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mb-3">"Platform ini sangat membantu dalam mengelola acara dan absensi peserta. Sangat mudah digunakan!"</p>
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">JD</div>
                    <div>
                      <h6 className="mb-0">John Doe</h6>
                      <small className="text-muted">Event Organizer</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-warning">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mb-3">"Fitur laporannya sangat lengkap. Saya bisa dengan mudah melihat statistik kehadiran peserta."</p>
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3">AS</div>
                    <div>
                      <h6 className="mb-0">Alice Smith</h6>
                      <small className="text-muted">HR Manager</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-warning">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mb-3">"Antarmuka yang intuitif dan fitur yang lengkap. Sangat merekomendasikan untuk manajemen acara."</p>
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3">BJ</div>
                    <div>
                      <h6 className="mb-0">Bob Johnson</h6>
                      <small className="text-muted">Project Manager</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <Card className="border-0 shadow-lg overflow-hidden">
            <Row className="g-0">
              <Col md={6} className="bg-primary text-white p-5">
                <h2 className="display-5 fw-bold mb-4">Siap Memulai?</h2>
                <p className="lead mb-4">Bergabunglah dengan ribuan pengguna yang telah mempercayai platform kami untuk manajemen acara mereka.</p>
                <Button variant="light" size="lg" onClick={() => navigate("/login")}>
                  <FaSignInAlt className="me-2" /> Daftar Sekarang
                </Button>
              </Col>
              <Col md={6} className="p-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="icon-circle bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                    <FaRocket />
                  </div>
                  <h5 className="mb-0">Cepat & Mudah</h5>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="icon-circle bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                    <FaMobileAlt />
                  </div>
                  <h5 className="mb-0">Mobile Friendly</h5>
                </div>
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                    <FaCheckCircle />
                  </div>
                  <h5 className="mb-0">Aman & Terpercaya</h5>
                </div>
              </Col>
            </Row>
          </Card>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-blue text-white py-5">
        <Container>
          <Row>
            <Col lg={4} className="mb-4 mb-lg-0">
              <div className="d-flex align-items-center mb-3">
                <div className="logo-circle bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                  <FaCalendarAlt />
                </div>
                <h3 className="mb-0">EventManager</h3>
              </div>
              <p className="text-muted">Platform terpadu untuk manajemen acara, peserta, dan absensi.</p>
            </Col>
            <Col lg={2} md={6} className="mb-4 mb-md-0">
              <h5 className="mb-3">Fitur</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Manajemen Acara
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Master Peserta
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Absensi Digital
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted text-decoration-none">
                    Laporan & Statistik
                  </a>
                </li>
              </ul>
            </Col>
            <Col lg={2} md={6} className="mb-4 mb-md-0">
              <h5 className="mb-3">Perusahaan</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Tentang Kami
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Karir
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted text-decoration-none">
                    Kontak
                  </a>
                </li>
              </ul>
            </Col>
            <Col lg={4}>
              <h5 className="mb-3">Newsletter</h5>
              <p className="text-muted mb-3">Dapatkan update terbaru dari kami</p>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Email Anda" />
                <Button variant="primary">Subscribe</Button>
              </div>
            </Col>
          </Row>
          <hr className="my-4 bg-secondary" />
          <Row>
            <Col md={6}>
              <p className="mb-0 text-muted">&copy; 2023 EventManager. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="d-flex justify-content-md-end gap-3">
                <a href="#" className="text-muted text-decoration-none">
                  Kebijakan Privasi
                </a>
                <a href="#" className="text-muted text-decoration-none">
                  Syarat & Ketentuan
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}
