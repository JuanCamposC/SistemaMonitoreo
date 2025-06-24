<?php
require_once 'conexion.php';

try {
    $conn = conectarBD();
    
    $query = "SELECT id, temperatura, fecha FROM temperatura ORDER BY fecha DESC LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } else {
        echo json_encode(array("mensaje" => "No se encontraron datos de temperatura"));
    }
    
    $conn = null;
} catch (PDOException $e) {
    echo json_encode(array("error" => $e->getMessage()));
}
?>
