<?php
require "config.php";
requerir_nivel(2);
$d = solo_post();

$nombre    = trim($d['nombre'] ?? '');
$ciudad    = trim($d['ciudad'] ?? '');
$direccion = trim($d['direccion'] ?? '');
$cant      = (int)($d['cantempleado'] ?? 0);
if ($nombre === '' || $ciudad === '' || $direccion === '') { fallar(400, "Completá nombre, ciudad y dirección"); }
if ($cant < 0) { fallar(400, "La cantidad de empleados no puede ser negativa"); }

$st = $db->prepare("INSERT INTO sucursal (nombre, ciudad, direccion, cantempleado, activo) VALUES (?, ?, ?, ?, 1)");
$st->bind_param("sssi", $nombre, $ciudad, $direccion, $cant);
if (!$st->execute()) { fallar(400, "No se pudo crear la sucursal"); }
echo json_encode(["ok" => true, "idSucursal" => $db->insert_id]);
