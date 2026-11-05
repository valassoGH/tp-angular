<?php
require "config.php";
requerir_nivel(1);
$d = solo_post();

$idCliente  = (int)($d['idCliente'] ?? 0);
$idSucursal = (int)($d['idSucursal'] ?? 0);
$importe    = round((float)($d['importe'] ?? 0), 2);
$fecha      = $d['fecha'] ?? date('Y-m-d');

if ($idCliente <= 0 || $idSucursal <= 0) { fallar(400, "Elegí cliente y sucursal"); }
if ($importe <= 0 || $importe > 9999999999) { fallar(400, "El importe debe ser mayor a cero"); }
$f = DateTime::createFromFormat('Y-m-d', $fecha);
if (!$f || $f->format('Y-m-d') !== $fecha) { fallar(400, "Fecha inválida"); }

$st = $db->prepare("SELECT activo FROM sucursal WHERE idSucursal = ?");
$st->bind_param("i", $idSucursal);
$st->execute();
$s = $st->get_result()->fetch_assoc();
if (!$s || !$s['activo']) { fallar(400, "La sucursal no existe o está dada de baja"); }

$iva = round($importe * 0.21, 2);   // IVA 21 %
$st = $db->prepare("INSERT INTO facturas (FechaFactura, IdCliente, Importe, IVA, Estado, idSucursal)
                    VALUES (?, ?, ?, ?, 'Pendiente', ?)");
$st->bind_param("siddi", $fecha, $idCliente, $importe, $iva, $idSucursal);
if (!$st->execute()) { fallar(400, "No se pudo guardar la factura (verificá el cliente)"); }

echo json_encode(["ok" => true, "nroFactura" => $db->insert_id]);
