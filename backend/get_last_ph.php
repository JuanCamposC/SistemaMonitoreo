<?php
// Headers CORS para permitir peticiones desde Angular
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conexion.php';

try {
    $conn = conectarBD();
    
    $query = "SELECT id, ph, fecha FROM ph ORDER BY fecha DESC LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } else {
        echo json_encode(array("mensaje" => "No se encontraron datos de pH"));
    }
    
    $conn = null;
} catch (PDOException $e) {
    echo json_encode(array("error" => $e->getMessage()));
}
?>
