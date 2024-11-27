<?php
require 'config.php';
header('Content-Type: application/json');

$response = array('success' => false, 'message' => '');

try {
    $nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_STRING);
    $edad = filter_input(INPUT_POST, 'edad', FILTER_VALIDATE_INT);
    $direccion = filter_input(INPUT_POST, 'direccion', FILTER_SANITIZE_STRING);
    $sexo = filter_input(INPUT_POST, 'sexo', FILTER_SANITIZE_STRING);
    $peliculas = '';

    if (isset($_POST['peliculas']) && is_array($_POST['peliculas'])) {
        $peliculas = implode(', ', array_map('htmlspecialchars', $_POST['peliculas'])); // Convierte el arreglo en una cadena
    }

    if (empty($nombre) || !preg_match("/^[a-zA-Z\s]+$/", $nombre)) {
        throw new Exception("Nombre inválido.");
    }
    if ($edad === false || $edad < 18) {
        throw new Exception("Debes ser mayor de 18 años.");
    }
    if (empty($direccion)) {
        throw new Exception("La dirección es obligatoria.");
    }
    if (empty($sexo)) {
        throw new Exception("Selecciona un sexo.");
    }
    if (count($_POST['peliculas']) < 1 || count($_POST['peliculas']) > 3) {
        throw new Exception("Selecciona entre 1 y 3 películas.");
    }

    $stmt = $pdo->prepare("INSERT INTO reserva (nombre, edad, direccion, sexo, peliculas) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$nombre, $edad, $direccion, $sexo, $peliculas]);

    $response['success'] = true;
    $response['message'] = "Reserva guardada exitosamente.";
} catch (Exception $e) {
    $response['message'] = "Error: " . $e->getMessage();
}

echo json_encode($response);
?>
