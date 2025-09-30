import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Card, Alert, Container, Row, Col } from "react-bootstrap";
import { FaCalendarAlt, FaArrowLeft, FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(username, password);
      // Redirect will be handled by AuthContext
    } catch (err) {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="w-100">
          <Col md={8} lg={5} className="mx-auto">
            <div className="text-center mb-4">
              <div className="logo-circle bg-white text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                <FaCalendarAlt size={30} />
              </div>
              <h2 className="fw-bold">EventManager</h2>
              <p className="text-muted">Masuk ke akun admin Anda</p>
            </div>

            <Card className="border-0 shadow-lg">
              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-primary bg-opacity-10 text-primary border-end-0">
                        <FaEnvelope />
                      </span>
                      <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="border-start-0" />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-primary bg-opacity-10 text-primary border-end-0">
                        <FaLock />
                      </span>
                      <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border-start-0" />
                    </div>
                  </Form.Group>
                  <Button disabled={loading} className="w-100 btn-cta" type="submit">
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <Button variant="link" onClick={() => navigate("/")} className="text-muted">
                <FaArrowLeft className="me-2" /> Kembali ke Beranda
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
