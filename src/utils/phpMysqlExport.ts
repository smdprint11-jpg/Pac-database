import {
  Officer,
  UnitOrganization,
  Member,
  SpDocument,
  Activity,
  Supervisor,
  Alumni,
  WebsiteSettings,
} from '../types';

function escapeSql(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return 'NULL';
  if (typeof val === 'number') return String(val);
  const cleaned = String(val)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n');
  return `'${cleaned}'`;
}

export function generateMySqlDump(params: {
  settings: WebsiteSettings;
  officers: Officer[];
  units: UnitOrganization[];
  members: Member[];
  spDocuments: SpDocument[];
  activities: Activity[];
  supervisors: Supervisor[];
  alumni: Alumni[];
}): string {
  const {
    settings,
    officers,
    units,
    members,
    spDocuments,
    activities,
    supervisors,
    alumni,
  } = params;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const lines: string[] = [
    `-- ============================================================================`,
    `-- DATABASE MYSQL DUMP: PELAJAR NU DUKUN (PAC IPNU IPPNU KECAMATAN DUKUN)`,
    `-- Waktu Ekspor: ${now}`,
    `-- Kompatibel dengan: MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.4+ (XAMPP / cPanel)`,
    `-- ============================================================================`,
    ``,
    `SET NAMES utf8mb4;`,
    `SET FOREIGN_KEY_CHECKS = 0;`,
    ``,
    `CREATE DATABASE IF NOT EXISTS \`db_pelajar_nu_dukun\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    `USE \`db_pelajar_nu_dukun\`;`,
    ``,
    `-- 1. Tabel Sinkronisasi Koleksi State Aplikasi`,
    `CREATE TABLE IF NOT EXISTS \`app_state_collections\` (`,
    `  \`id\` INT AUTO_INCREMENT PRIMARY KEY,`,
    `  \`collection_key\` VARCHAR(100) NOT NULL UNIQUE,`,
    `  \`data_json\` LONGTEXT NOT NULL,`,
    `  \`updated_by_uid\` VARCHAR(128) DEFAULT NULL,`,
    `  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    ``,
    `-- 2. Tabel Pengurus PAC & Ranting/PK`,
    `CREATE TABLE IF NOT EXISTS \`pac_officers\` (`,
    `  \`id\` VARCHAR(64) PRIMARY KEY,`,
    `  \`full_name\` VARCHAR(150) NOT NULL,`,
    `  \`nia\` VARCHAR(64) DEFAULT NULL,`,
    `  \`position\` VARCHAR(150) NOT NULL,`,
    `  \`department\` VARCHAR(150) DEFAULT NULL,`,
    `  \`organization\` VARCHAR(20) NOT NULL,`,
    `  \`phone\` VARCHAR(40) DEFAULT NULL,`,
    `  \`email\` VARCHAR(150) DEFAULT NULL,`,
    `  \`photo_url\` LONGTEXT DEFAULT NULL,`,
    `  \`period\` VARCHAR(50) DEFAULT '2024 - 2026',`,
    `  \`status\` VARCHAR(30) DEFAULT 'Aktif',`,
    `  \`unit_id\` VARCHAR(64) DEFAULT NULL,`,
    `  \`unit_name\` VARCHAR(150) DEFAULT NULL,`,
    `  \`order_index\` INT DEFAULT 1,`,
    `  \`bio\` TEXT DEFAULT NULL,`,
    `  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
    `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    ``,
    `-- 3. Tabel Pangkalan Ranting & Komisariat (PK)`,
    `CREATE TABLE IF NOT EXISTS \`units\` (`,
    `  \`id\` VARCHAR(64) PRIMARY KEY,`,
    `  \`name\` VARCHAR(150) NOT NULL,`,
    `  \`type\` VARCHAR(30) NOT NULL,`,
    `  \`village_or_school\` VARCHAR(150) NOT NULL,`,
    `  \`leader_ipnu\` VARCHAR(150) DEFAULT NULL,`,
    `  \`leader_ippnu\` VARCHAR(150) DEFAULT NULL,`,
    `  \`phone_leader\` VARCHAR(40) DEFAULT NULL,`,
    `  \`address\` TEXT DEFAULT NULL,`,
    `  \`active_status\` VARCHAR(40) DEFAULT 'AKTIF',`,
    `  \`sp_ipnu_status\` VARCHAR(40) DEFAULT 'BELUM_TERSEDIA',`,
    `  \`sp_ippnu_status\` VARCHAR(40) DEFAULT 'BELUM_TERSEDIA',`,
    `  \`members_count\` INT DEFAULT 0,`,
    `  \`officers_count\` INT DEFAULT 0,`,
    `  \`activities_count\` INT DEFAULT 0,`,
    `  \`completeness_score\` INT DEFAULT 0,`,
    `  \`completeness_grade\` VARCHAR(50) DEFAULT 'Cukup',`,
    `  \`last_updated\` VARCHAR(30) DEFAULT NULL`,
    `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    ``,
    `-- 4. Tabel Database Anggota Kader`,
    `CREATE TABLE IF NOT EXISTS \`members\` (`,
    `  \`id\` VARCHAR(64) PRIMARY KEY,`,
    `  \`full_name\` VARCHAR(150) NOT NULL,`,
    `  \`nia\` VARCHAR(64) NOT NULL,`,
    `  \`gender\` CHAR(1) DEFAULT 'L',`,
    `  \`unit_id\` VARCHAR(64) NOT NULL,`,
    `  \`unit_name\` VARCHAR(150) NOT NULL,`,
    `  \`unit_type\` VARCHAR(30) NOT NULL,`,
    `  \`position\` VARCHAR(100) DEFAULT 'Anggota',`,
    `  \`school_or_occupation\` VARCHAR(150) DEFAULT NULL,`,
    `  \`phone\` VARCHAR(40) DEFAULT NULL,`,
    `  \`membership_status\` VARCHAR(40) DEFAULT 'Aktif',`,
    `  \`created_at\` VARCHAR(30) DEFAULT NULL`,
    `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    ``,
    `-- 5. Data Pengurus PAC & Unit`,
  ];

  for (const o of officers) {
    lines.push(
      `REPLACE INTO \`pac_officers\` (\`id\`, \`full_name\`, \`nia\`, \`position\`, \`department\`, \`organization\`, \`phone\`, \`email\`, \`photo_url\`, \`period\`, \`status\`, \`unit_id\`, \`unit_name\`, \`order_index\`, \`bio\`) VALUES (${escapeSql(
        o.id
      )}, ${escapeSql(o.fullName)}, ${escapeSql(o.nia)}, ${escapeSql(o.position)}, ${escapeSql(
        o.department
      )}, ${escapeSql(o.organization)}, ${escapeSql(o.phone)}, ${escapeSql(o.email)}, ${escapeSql(
        o.photoUrl || o.avatar
      )}, ${escapeSql(o.period)}, ${escapeSql(o.status)}, ${escapeSql(o.unitId)}, ${escapeSql(
        o.unitName
      )}, ${o.orderIndex ?? o.displayOrder ?? 1}, ${escapeSql(o.bio || o.description)});`
    );
  }

  lines.push(``, `-- 6. Data Pangkalan Ranting & Komisariat`);
  for (const u of units) {
    lines.push(
      `REPLACE INTO \`units\` (\`id\`, \`name\`, \`type\`, \`village_or_school\`, \`leader_ipnu\`, \`leader_ippnu\`, \`phone_leader\`, \`address\`, \`active_status\`, \`sp_ipnu_status\`, \`sp_ippnu_status\`, \`members_count\`, \`officers_count\`, \`activities_count\`, \`completeness_score\`, \`completeness_grade\`, \`last_updated\`) VALUES (${escapeSql(
        u.id
      )}, ${escapeSql(u.name)}, ${escapeSql(u.type)}, ${escapeSql(u.villageOrSchool)}, ${escapeSql(
        u.leaderIpnu
      )}, ${escapeSql(u.leaderIppnu)}, ${escapeSql(u.phoneLeader)}, ${escapeSql(
        u.address
      )}, ${escapeSql(u.activeStatus)}, ${escapeSql(u.spIpnuStatus)}, ${escapeSql(
        u.spIppnuStatus
      )}, ${u.membersCount}, ${u.officersCount}, ${u.activitiesCount}, ${u.completenessScore}, ${escapeSql(
        u.completenessGrade
      )}, ${escapeSql(u.lastUpdated)});`
    );
  }

  lines.push(``, `-- 7. Data Anggota Kader`);
  for (const m of members) {
    lines.push(
      `REPLACE INTO \`members\` (\`id\`, \`full_name\`, \`nia\`, \`gender\`, \`unit_id\`, \`unit_name\`, \`unit_type\`, \`position\`, \`school_or_occupation\`, \`phone\`, \`membership_status\`, \`created_at\`) VALUES (${escapeSql(
        m.id
      )}, ${escapeSql(m.fullName)}, ${escapeSql(m.nia)}, ${escapeSql(m.gender)}, ${escapeSql(
        m.unitId
      )}, ${escapeSql(m.unitName)}, ${escapeSql(m.unitType)}, ${escapeSql(
        m.position
      )}, ${escapeSql(m.schoolOrOccupation || m.occupation)}, ${escapeSql(m.phone)}, ${escapeSql(
        m.membershipStatus
      )}, ${escapeSql(m.createdAt)});`
    );
  }

  lines.push(``, `-- 8. Koleksi State JSON Terpadu`);
  const collectionsMap: Record<string, unknown> = {
    settings,
    officers,
    units,
    members,
    spDocs: spDocuments,
    activities,
    supervisors,
    alumni,
  };

  for (const [key, val] of Object.entries(collectionsMap)) {
    lines.push(
      `REPLACE INTO \`app_state_collections\` (\`collection_key\`, \`data_json\`) VALUES (${escapeSql(
        key
      )}, ${escapeSql(JSON.stringify(val))});`
    );
  }

  lines.push(``, `SET FOREIGN_KEY_CHECKS = 1;`);
  return lines.join('\n');
}
