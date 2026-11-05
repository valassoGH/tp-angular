<?php
// Total facturado (sin IVA) por mes y sucursal de un año (por defecto 2025)
require "config.php";
requerir_nivel(1);
$anio = isset($_GET['anio']) ? (int)$_GET['anio'] : 2025;
responder($db, "SELECT MONTH(FechaFactura) AS mes, idSucursal, SUM(Importe) AS total
                FROM facturas
                WHERE YEAR(FechaFactura) = $anio
                GROUP BY MONTH(FechaFactura), idSucursal
                ORDER BY mes, idSucursal");
