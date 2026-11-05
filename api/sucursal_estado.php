<?php
// Baja (activo = 0) o reactivación (activo = 1) de una sucursal. No se borra: tiene facturas asociadas.
require "config.php";
requerir_nivel(2);
$d = solo_post();

$id = (int)($d['idSucursal'] ?? 0);
$activo = empty($d['activo']) ? 0 : 1;

$st = $db->prepare("UPDATE sucursal SET activo = ? WHERE idSucursal = ?");
$st->bind_param("ii", $activo, $id);
$st->execute();
echo json_encode(["ok" => true]);
