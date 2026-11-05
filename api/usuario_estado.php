<?php
// Baja (activo = 0) o alta (activo = 1) de un usuario
require "config.php";
$yo = requerir_nivel(2);
$d = solo_post();

$id = (int)($d['idUsuario'] ?? 0);
$activo = empty($d['activo']) ? 0 : 1;
if ($id === (int)$yo['idUsuario'] && !$activo) { fallar(400, "No podés darte de baja a vos mismo"); }

$st = $db->prepare("UPDATE usuario SET activo = ? WHERE idUsuario = ?");
$st->bind_param("ii", $activo, $id);
$st->execute();
echo json_encode(["ok" => true]);
