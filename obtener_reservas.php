<?php
require 'config.php';
try {
    $sql = "SELECT * FROM reserva";
    $stmt = $pdo->query($sql);

    $reservas = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $reservas[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($reservas);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>