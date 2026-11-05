<?php
require "config.php";
$d = solo_post();
$usuario = trim($d['usuario'] ?? '');
$clave   = $d['clave'] ?? '';

$st = $db->prepare("SELECT idUsuario, usuario, clave, categoria, nivel
                    FROM usuario WHERE usuario = ? AND activo = 1");
$st->bind_param("s", $usuario);
$st->execute();
$u = $st->get_result()->fetch_assoc();

if ($u && password_verify($clave, $u['clave'])) {
    unset($u['clave']);                       // nunca devolver el hash
    session_regenerate_id(true);
    $_SESSION['usuario'] = $u;
    echo json_encode(["ok" => true, "usuario" => $u], JSON_NUMERIC_CHECK);
} else {
    fallar(401, "Usuario o contraseña incorrectos");
}
