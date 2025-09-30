import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { Card, Table, Badge } from "react-bootstrap";

function fetchStatistics() {
  const now = new Date();
  return api.get(`/absensi/statistics/month/${now.getFullYear()}/${now.getMonth() + 1}`).then((res) => res.data);
}

export default function Statistics() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["statistics"],
    queryFn: fetchStatistics,
  });

  if (isLoading) return <div className="text-center py-5">Loading statistics...</div>;
  if (isError) return <div className="alert alert-danger">Error loading statistics</div>;

  // re 
  //   <Card>
  //     <Card.Body>
  //       <Card.Title className="d-flex align-items-center">
  //         <span className="me-2">📊</span> Statistik Kehadiran Bulan Ini
  //       </Card.Title>

  //       <Table striped bordered hover responsive>
  //         <thead>
  //           <tr>
  //             <th>Status</th>
  //             <th>Jumlah</th>
  //             <th>Persentase</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {stats.map((stat, index) => (
  //             <tr key={index}>
  //               <td>
  //                 <Badge
  //                   bg={
  //                     stat.status_kehadiran === "Hadir"
  //                       ? "success"
  //                       : stat.status_kehadiran === "Terlambat"
  //                       ? "warning"
  //                       : stat.status_kehadiran === "Izin"
  //                       ? "info"
  //                       : stat.status_kehadiran === "Sakit"
  //                       ? "secondary"
  //                       : "danger"
  //                   }
  //                 >
  //                   {stat.status_kehadiran}
  //                 </Badge>
  //               </td>
  //               <td>{stat.jumlah}</td>
  //               <td>{stat.persentase}%</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </Table>
  //     </Card.Body>
  //   </Card>
  // );
}
