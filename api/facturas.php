<?php
// Listado paginado de facturas con filtros: estado, sucursal y búsqueda (cliente o número)
require "config.php";
requerir_nivel(1);

$pagina = max(1, (int)($_GET['pagina'] ?? 1));
$porPagina = 15;

$cond = []; $tipos = ""; $vals = [];
if (in_array($_GET['estado'] ?? '', ['Pendiente', 'Pagado', 'Atrasado'], true)) {
    $cond[] = "f.Estado = ?"; $tipos .= "s"; $vals[] = $_GET['estado'];
}
if (!empty($_GET['sucursal'])) {
    $cond[] = "f.idSucursal = ?"; $tipos .= "i"; $vals[] = (int)$_GET['sucursal'];
}
$buscar = trim($_GET['buscar'] ?? '');
if ($buscar !== '') {
    $cond[] = "(c.apellido LIKE ? OR c.nombre LIKE ? OR f.NroFactura = ?)";
    $tipos .= "ssi"; $vals[] = "%$buscar%"; $vals[] = "%$buscar%"; $vals[] = (int)$buscar;
}
$where = $cond ? "WHERE " . implode(" AND ", $cond) : "";
$from  = "FROM facturas f JOIN cliente c ON c.idCliente = f.IdCliente
          JOIN sucursal s ON s.idSucursal = f.idSucursal $where";

function consultar(mysqli $db, string $sql, string $tipos, array $vals): array {
    $st = $db->prepare($sql);
    if ($st === false) { fallar(500, "Error en la consulta"); }
    if ($tipos !== "") { $st->bind_param($tipos, ...$vals); }
    $st->execute();
    return $st->get_result()->fetch_all(MYSQLI_ASSOC);
}

$resumen = consultar($db, "SELECT COUNT(*) AS total, COALESCE(SUM(f.Importe + f.IVA), 0) AS suma $from", $tipos, $vals)[0];

$offset = ($pagina - 1) * $porPagina;
$filas = consultar($db,
    "SELECT f.NroFactura, f.FechaFactura, CONCAT(c.apellido, ', ', c.nombre) AS cliente,
            s.nombre AS sucursal, f.Importe, f.IVA, (f.Importe + f.IVA) AS total, f.Estado
     $from ORDER BY f.FechaFactura DESC, f.NroFactura DESC LIMIT $porPagina OFFSET $offset",
    $tipos, $vals);

echo json_encode([
    "total" => (int)$resumen['total'],
    "suma" => (float)$resumen['suma'],
    "pagina" => $pagina,
    "porPagina" => $porPagina,
    "filas" => $filas,
], JSON_NUMERIC_CHECK);
