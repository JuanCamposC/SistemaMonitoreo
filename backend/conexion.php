<?php
// Preventing direct script access
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Database credentials - should be in a secure config file in production
define('DB_HOST', 'localhost');
define('DB_NAME', 'CIMARQ');
define('DB_USER', 'sensor');     // Change to your actual username
define('DB_PASS', 'Limache1695&');         // Change to your actual password

// Create connection with try-catch for error handling
function conectarBD() {
    try {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS,
            array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'")
        );
        
        // Set error mode
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        // Return error as JSON
        echo json_encode(array("error" => "Connection failed: " . $e->getMessage()));
        die();
    }
}
?>
