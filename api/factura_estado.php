<?php
require "config.php";
requerir_nivel(1);
$d = solo_post();

$nro = (int)($d['nroFactura'] ?? 0);
$estado = $d['estado'] ?? '';
if (!in_array($estado, ['Pendiente', 'Pagado', 'Atrasado'], true)) { fallar(400, "Estado inválido"); }

$st = $db->prepare("UPDATE facturas SET Estado = ? WHERE NroFactura = ?");
$st->bind_param("si", $estado, $nro);
$st->execute();
echo json_encode(["ok" => true]);
