<?php
/**
 * REST API Endpoint PHP & MySQL - PELAJAR NU DUKUN
 * Mendukung sinkronisasi real-time untuk Pengurus PAC, Ranting/PK, Anggota, SP, Berita, Pelindung & Pembina
 */

require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = getMysqlConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? 'state';

    // 1. GET /api.php?action=state -> Ambil seluruh koleksi data & tabel pengurus
    if ($method === 'GET' && $action === 'state') {
        $stmt = $pdo->query("SELECT collection_key, data_json, updated_at FROM app_state_collections");
        $collections = [];
        while ($row = $stmt->fetch()) {
            $decoded = json_decode($row['data_json'], true);
            if ($decoded !== null) {
                $collections[$row['collection_key']] = $decoded;
            }
        }

        $offStmt = $pdo->query("SELECT * FROM pac_officers ORDER BY order_index ASC");
        $officers = $offStmt->fetchAll();

        echo json_encode([
            'ok' => true,
            'collections' => $collections,
            'sqlOfficers' => $officers
        ]);
        exit;
    }

    // 2. POST /api.php?action=state -> Simpan / Sinkronkan perubahan koleksi & tabel MySQL
    if ($method === 'POST' && $action === 'state') {
        $rawBody = file_get_contents('php://input');
        $payload = json_decode($rawBody, true);
        $collectionKey = $payload['collectionKey'] ?? '';
        $data = $payload['data'] ?? null;

        if ($collectionKey === '' || $data === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Parameter collectionKey dan data wajib diisi']);
            exit;
        }

        $jsonString = json_encode($data, JSON_UNESCAPED_UNICODE);
        $stmt = $pdo->prepare("
            INSERT INTO app_state_collections (collection_key, data_json, updated_at)
            VALUES (:key, :json, NOW())
            ON DUPLICATE KEY UPDATE data_json = VALUES(data_json), updated_at = NOW()
        ");
        $stmt->execute([
            ':key'  => $collectionKey,
            ':json' => $jsonString
        ]);

        // Sinkronisasi otomatis ke tabel relasional pac_officers jika collectionKey === 'officers'
        if ($collectionKey === 'officers' && is_array($data)) {
            $upsertOfficer = $pdo->prepare("
                INSERT INTO pac_officers (
                    id, full_name, nia, position, department, organization,
                    phone, email, photo_url, period, status, unit_id, unit_name,
                    order_index, bio, updated_at
                ) VALUES (
                    :id, :full_name, :nia, :position, :department, :organization,
                    :phone, :email, :photo_url, :period, :status, :unit_id, :unit_name,
                    :order_index, :bio, NOW()
                )
                ON DUPLICATE KEY UPDATE
                    full_name = VALUES(full_name),
                    nia = VALUES(nia),
                    position = VALUES(position),
                    department = VALUES(department),
                    organization = VALUES(organization),
                    phone = VALUES(phone),
                    email = VALUES(email),
                    photo_url = VALUES(photo_url),
                    period = VALUES(period),
                    status = VALUES(status),
                    unit_id = VALUES(unit_id),
                    unit_name = VALUES(unit_name),
                    order_index = VALUES(order_index),
                    bio = VALUES(bio),
                    updated_at = NOW()
            ");

            foreach ($data as $off) {
                if (!empty($off['id']) && !empty($off['fullName'])) {
                    $upsertOfficer->execute([
                        ':id'           => $off['id'],
                        ':full_name'    => $off['fullName'],
                        ':nia'          => $off['nia'] ?? null,
                        ':position'     => $off['position'] ?? 'Pengurus',
                        ':department'   => $off['department'] ?? null,
                        ':organization' => $off['organization'] ?? 'IPNU',
                        ':phone'        => $off['phone'] ?? null,
                        ':email'        => $off['email'] ?? null,
                        ':photo_url'    => $off['photoUrl'] ?? $off['avatar'] ?? null,
                        ':period'       => $off['period'] ?? '2024 - 2026',
                        ':status'       => $off['status'] ?? 'Aktif',
                        ':unit_id'      => $off['unitId'] ?? null,
                        ':unit_name'    => $off['unitName'] ?? null,
                        ':order_index'  => (int)($off['orderIndex'] ?? $off['displayOrder'] ?? 1),
                        ':bio'          => $off['bio'] ?? $off['description'] ?? null,
                    ]);
                }
            }
        }

        echo json_encode([
            'ok' => true,
            'collectionKey' => $collectionKey,
            'updatedAt' => date('Y-m-d H:i:s')
        ]);
        exit;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Endpoint tidak ditemukan']);
} catch (Throwable $e) {
    error_log('MySQL API Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Terjadi kesalahan pada server database']);
}
