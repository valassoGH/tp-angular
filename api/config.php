<?php
// Configuración común: sesión, cabeceras CORS, conexión a MySQL y helpers
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'samesite' => 'Lax']);
session_start();

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

mysqli_report(MYSQLI_REPORT_OFF);
$db = @new mysqli("localhost", "root", "", "bdfacturas");   // XAMPP: root sin clave
if ($db->connect_errno) {
    fallar(500, "No se pudo conectar a la base de datos");
}
$db->set_charset("utf8mb4");

function fallar(int $codigo, string $mensaje): void {
    http_response_code($codigo);
    echo json_encode(["error" => $mensaje]);
    exit;
}

// Exige sesión iniciada y un nivel mínimo (1 = Empleado, 2 = Administrador)
function requerir_nivel(int $nivel): array {
    if (empty($_SESSION['usuario'])) { fallar(401, "Sesión no iniciada"); }
    if ($_SESSION['usuario']['nivel'] < $nivel) { fallar(403, "No tenés permiso para esta acción"); }
    return $_SESSION['usuario'];
}

function solo_post(): array {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { fallar(405, "Método no permitido"); }
    return json_decode(file_get_contents("php://input"), true) ?? [];
}

function responder(mysqli $db, string $sql): void {
    $res = $db->query($sql);
    if ($res === false) { fallar(500, "Error en la consulta"); }
    echo json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_NUMERIC_CHECK);
}
