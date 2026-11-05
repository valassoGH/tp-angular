<?php
require "config.php";
requerir_nivel(2);
$d = solo_post();

$usuario = trim($d['usuario'] ?? '');
$clave = $d['clave'] ?? '';
$nivel = (int)($d['nivel'] ?? 0);
if (!in_array($nivel, [1, 2], true)) { fallar(400, "Categoría inválida"); }
$categoria = $nivel === 2 ? 'Administrador' : 'Empleado';

if (!preg_match('/^[A-Za-z0-9_.-]{3,50}$/', $usuario)) { fallar(400, "El usuario debe tener 3 a 50 caracteres (letras, números, . _ -)"); }
if (strlen($clave) < 6) { fallar(400, "La contraseña debe tener al menos 6 caracteres"); }

$hash = password_hash($clave, PASSWORD_DEFAULT);
$st = $db->prepare("INSERT INTO usuario (usuario, clave, categoria, nivel, activo) VALUES (?, ?, ?, ?, 1)");
$st->bind_param("sssi", $usuario, $hash, $categoria, $nivel);
if (!$st->execute()) {
    fallar($db->errno === 1062 ? 409 : 400, $db->errno === 1062 ? "Ese usuario ya existe" : "No se pudo crear el usuario");
}
echo json_encode(["ok" => true, "idUsuario" => $db->insert_id]);
