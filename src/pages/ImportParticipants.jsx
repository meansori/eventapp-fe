import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { Card, Button, Form, Alert, Table } from "react-bootstrap";
import { FaFileImport, FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";

export default function ImportParticipants() {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const importParticipants = useMutation({
    mutationFn: (data) => api.post("/peserta/import", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["participants"]);
      setFile(null);
      setPreviewData([]);
      alert("Import berhasil!");
    },
    onError: (err) => {
      setError("Gagal import: " + (err.response?.data?.message || err.message));
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validasi data
      const validData = jsonData.map((row) => ({
        nama_peserta: row["Nama Peserta"] || row["nama_peserta"] || "",
        asal: row["Asal"] || row["asal"] || "",
        kategori: row["Kategori"] || row["kategori"] || "",
        jenis_kelamin: row["Jenis Kelamin"] || row["jenis_kelamin"] || "",
        agama: row["Agama"] || row["agama"] || "",
      }));

      setPreviewData(validData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleImport = () => {
    if (!file || previewData.length === 0) {
      setError("Silakan pilih file terlebih dahulu");
      return;
    }

    importParticipants.mutate({
      participants: previewData,
      created_by: currentUser.id,
    });
  };

  const downloadTemplate = () => {
    const template = [
      {
        "Nama Peserta": "",
        "Jenis Kelamin": "Laki-laki",
        Agama: "Islam",
        Asal: "",
        Kategori: "",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_peserta.xlsx");
  };

  return (
    <div>
      <h1 className="mb-4">Import Peserta</h1>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Upload File Excel</h5>
            <Button variant="outline-primary" onClick={downloadTemplate}>
              <FaDownload className="me-2" /> Download Template
            </Button>
          </div>

          <Form.Group>
            <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          </Form.Group>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {previewData.length > 0 && (
            <div className="mt-4">
              <h6>Preview Data ({previewData.length} peserta)</h6>
              <div className="table-responsive" style={{ maxHeight: "300px" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nama Peserta</th>
                      <th>Jenis Kelamin</th>
                      <th>Agama</th>
                      <th>Asal</th>
                      <th>Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        <td>{row.nama_peserta}</td>
                        <td>{row.jenis_kelamin}</td>
                        <td>{row.agama}</td>
                        <td>{row.asal}</td>
                        <td>{row.kategori}</td>
                      </tr>
                    ))}
                    {previewData.length > 5 && (
                      <tr>
                        <td colSpan={5} className="text-center">
                          ... dan {previewData.length - 5} data lainnya
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              <div className="text-end mt-3">
                <Button variant="primary" onClick={handleImport} disabled={importParticipants.isLoading}>
                  <FaFileImport className="me-2" />
                  {importParticipants.isLoading ? "Importing..." : "Import Data"}
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
