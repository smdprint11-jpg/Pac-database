import { jsPDF } from 'jspdf';
import { Member, Officer, WebsiteSettings } from '../types';

async function loadImageAsDataUrl(url?: string): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:image/')) {
    return url;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timeout = setTimeout(() => {
      resolve(null);
    }, 3500);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const targetWidth = 180;
        const targetHeight = 220;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Cover-fit crop
        const imgRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;
        let sx = 0;
        let sy = 0;
        let sWidth = img.width;
        let sHeight = img.height;

        if (imgRatio > targetRatio) {
          sWidth = img.height * targetRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / targetRatio;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(null);
    };

    img.src = url;
  });
}

function drawDocumentHeader(
  doc: jsPDF,
  settings: WebsiteSettings,
  logoDataUrl: string | null,
  reportTitle: string,
  subtitle: string
) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Emerald Banner Accent
  doc.setFillColor(6, 95, 70); // emerald-800
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Logo or NU Badge on Left
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'JPEG', 14, 11, 18, 18);
    } catch {
      doc.setFillColor(5, 150, 105);
      doc.roundedRect(14, 11, 18, 18, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('NU', 23, 22, { align: 'center' });
    }
  } else {
    doc.setFillColor(5, 150, 105);
    doc.roundedRect(14, 11, 18, 18, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('NU', 23, 22, { align: 'center' });
  }

  // Organization Header Text
  doc.setTextColor(6, 78, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(
    (settings.organization || settings.organizationName || 'PIMPINAN ANAK CABANG IPNU IPPNU KECAMATAN DUKUN').toUpperCase(),
    36,
    16
  );

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(reportTitle.toUpperCase(), 36, 22);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `${subtitle} • ${settings.period || 'Masa Khidmat 2024 - 2026'} • Dicetak: ${new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })}`,
    36,
    27
  );

  // Double horizontal line
  doc.setDrawColor(6, 95, 70);
  doc.setLineWidth(0.7);
  doc.line(14, 32, pageWidth - 14, 32);
  doc.setLineWidth(0.2);
  doc.line(14, 33.2, pageWidth - 14, 33.2);
}

export async function exportMembersToPdf(
  members: Member[],
  settings: WebsiteSettings,
  scopeTitle: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const logoUrl = settings.navbarLogoUrl || settings.logoUrl;
  const logoDataUrl = await loadImageAsDataUrl(logoUrl);

  // Preload all member photos in parallel
  const photoMap = new Map<string, string | null>();
  await Promise.all(
    members.map(async (m) => {
      const dataUrl = await loadImageAsDataUrl(m.avatar);
      photoMap.set(m.id, dataUrl);
    })
  );

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const drawTableHeader = (yPos: number) => {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, yPos, pageWidth - 28, 8, 'FD');

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('NO', 17, yPos + 5.2);
    doc.text('FOTO', 26, yPos + 5.2);
    doc.text('NAMA LENGKAP & NIA', 44, yPos + 5.2);
    doc.text('ORG', 96, yPos + 5.2);
    doc.text('PANGKALAN / RANTING', 110, yPos + 5.2);
    doc.text('TTL & SEKOLAH', 150, yPos + 5.2);
    doc.text('NO. WA', 180, yPos + 5.2);
  };

  drawDocumentHeader(
    doc,
    settings,
    logoDataUrl,
    'DATA REAL DATABASE ANGGOTA & KADER BESERTA PAS FOTO',
    scopeTitle
  );

  let currentY = 37;
  drawTableHeader(currentY);
  currentY += 8;

  const rowHeight = 20;

  members.forEach((member, idx) => {
    if (currentY + rowHeight > pageHeight - 25) {
      doc.addPage();
      drawDocumentHeader(
        doc,
        settings,
        logoDataUrl,
        'DATA REAL DATABASE ANGGOTA & KADER BESERTA PAS FOTO',
        scopeTitle
      );
      currentY = 37;
      drawTableHeader(currentY);
      currentY += 8;
    }

    // Alternating row background
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, pageWidth - 28, rowHeight, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.rect(14, currentY, pageWidth - 28, rowHeight, 'S');

    // No
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(String(idx + 1), 18, currentY + 11);

    // Pas Foto (13mm x 16mm)
    const photoData = photoMap.get(member.id);
    if (photoData) {
      try {
        doc.addImage(photoData, 'JPEG', 25, currentY + 2, 13, 16);
        doc.setDrawColor(16, 185, 129);
        doc.rect(25, currentY + 2, 13, 16, 'S');
      } catch {
        drawInitialsBox(doc, member.fullName, 25, currentY + 2, 13, 16);
      }
    } else {
      drawInitialsBox(doc, member.fullName, 25, currentY + 2, 13, 16);
    }

    // Nama & NIA
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const nameLines = doc.splitTextToSize(member.fullName, 49);
    doc.text(nameLines.slice(0, 2), 44, currentY + 6.5);

    doc.setTextColor(5, 150, 105);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.text(`NIA: ${member.nia}`, 44, currentY + 14.5);

    // Gender / Org Badge
    const isIpnu = member.gender === 'L';
    doc.setFillColor(isIpnu ? 209 : 220, isIpnu ? 250 : 252, isIpnu ? 229 : 231);
    doc.roundedRect(95, currentY + 6, 12, 6, 1.5, 1.5, 'F');
    doc.setTextColor(6, 95, 70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(isIpnu ? 'IPNU' : 'IPPNU', 101, currentY + 10, { align: 'center' });

    // Unit Name
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const unitLines = doc.splitTextToSize(member.unitName || '-', 37);
    doc.text(unitLines.slice(0, 2), 110, currentY + 7.5);

    // TTL & Sekolah
    const ttlText = `${member.birthPlace || 'Gresik'}, ${member.birthDate || '-'}`;
    const schoolText = member.occupation || member.schoolOrOccupation || '-';
    doc.setFontSize(7);
    doc.text(doc.splitTextToSize(ttlText, 28).slice(0, 1), 150, currentY + 7);
    doc.setTextColor(100, 116, 139);
    doc.text(doc.splitTextToSize(schoolText, 28).slice(0, 2), 150, currentY + 11.5);

    // Phone
    doc.setTextColor(15, 23, 42);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.text(member.phone || '-', 180, currentY + 10);

    currentY += rowHeight;
  });

  // Footer summary
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Total Data Terdaftar: ${members.length} Kader • Sistem Informasi Database ${settings.siteName || 'PELAJAR NU DUKUN'}`,
      14,
      pageHeight - 10
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 14, pageHeight - 10, {
      align: 'right',
    });
  }

  const safeFileName = scopeTitle.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Database_Anggota_${safeFileName}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export async function exportOfficersToPdf(
  officers: Officer[],
  settings: WebsiteSettings,
  scopeTitle: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const logoUrl = settings.navbarLogoUrl || settings.logoUrl;
  const logoDataUrl = await loadImageAsDataUrl(logoUrl);

  const photoMap = new Map<string, string | null>();
  await Promise.all(
    officers.map(async (o) => {
      const dataUrl = await loadImageAsDataUrl(o.photoUrl || o.avatar);
      photoMap.set(o.id, dataUrl);
    })
  );

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const drawTableHeader = (yPos: number) => {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, yPos, pageWidth - 28, 8, 'FD');

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('NO', 17, yPos + 5.2);
    doc.text('FOTO', 26, yPos + 5.2);
    doc.text('NAMA PENGURUS & NIA', 44, yPos + 5.2);
    doc.text('ORG', 96, yPos + 5.2);
    doc.text('JABATAN STRUKTURAL', 110, yPos + 5.2);
    doc.text('DEPARTEMEN / BIDANG', 148, yPos + 5.2);
    doc.text('NO. WA', 180, yPos + 5.2);
  };

  drawDocumentHeader(
    doc,
    settings,
    logoDataUrl,
    'DATA REAL SUSUNAN PENGURUS PAC BESERTA PAS FOTO',
    scopeTitle
  );

  let currentY = 37;
  drawTableHeader(currentY);
  currentY += 8;

  const rowHeight = 20;

  officers.forEach((officer, idx) => {
    if (currentY + rowHeight > pageHeight - 25) {
      doc.addPage();
      drawDocumentHeader(
        doc,
        settings,
        logoDataUrl,
        'DATA REAL SUSUNAN PENGURUS PAC BESERTA PAS FOTO',
        scopeTitle
      );
      currentY = 37;
      drawTableHeader(currentY);
      currentY += 8;
    }

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, pageWidth - 28, rowHeight, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.rect(14, currentY, pageWidth - 28, rowHeight, 'S');

    // No
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(String(idx + 1), 18, currentY + 11);

    // Pas Foto
    const photoData = photoMap.get(officer.id);
    if (photoData) {
      try {
        doc.addImage(photoData, 'JPEG', 25, currentY + 2, 13, 16);
        doc.setDrawColor(16, 185, 129);
        doc.rect(25, currentY + 2, 13, 16, 'S');
      } catch {
        drawInitialsBox(doc, officer.fullName, 25, currentY + 2, 13, 16);
      }
    } else {
      drawInitialsBox(doc, officer.fullName, 25, currentY + 2, 13, 16);
    }

    // Nama & NIA
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const nameLines = doc.splitTextToSize(officer.fullName, 49);
    doc.text(nameLines.slice(0, 2), 44, currentY + 6.5);

    doc.setTextColor(5, 150, 105);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.text(`NIA: ${officer.nia || '-'}`, 44, currentY + 14.5);

    // Org
    const isIpnu = officer.organization === 'IPNU';
    doc.setFillColor(isIpnu ? 209 : 220, isIpnu ? 250 : 252, isIpnu ? 229 : 231);
    doc.roundedRect(95, currentY + 6, 12, 6, 1.5, 1.5, 'F');
    doc.setTextColor(6, 95, 70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(officer.organization, 101, currentY + 10, { align: 'center' });

    // Jabatan
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const posLines = doc.splitTextToSize(officer.position || '-', 35);
    doc.text(posLines.slice(0, 2), 110, currentY + 8.5);

    // Departemen
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const deptLines = doc.splitTextToSize(officer.department || 'Pengurus Harian', 30);
    doc.text(deptLines.slice(0, 2), 148, currentY + 8.5);

    // Phone
    doc.setTextColor(15, 23, 42);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.text(officer.phone || '-', 180, currentY + 10);

    currentY += rowHeight;
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Total Pengurus: ${officers.length} Orang • Sistem Informasi Database ${settings.siteName || 'PELAJAR NU DUKUN'}`,
      14,
      pageHeight - 10
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 14, pageHeight - 10, {
      align: 'right',
    });
  }

  doc.save(`Database_Pengurus_PAC_Dukun_${new Date().toISOString().split('T')[0]}.pdf`);
}

function drawInitialsBox(doc: jsPDF, name: string, x: number, y: number, w: number, h: number) {
  doc.setFillColor(209, 250, 229);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(x, y, w, h, 1.5, 1.5, 'FD');
  doc.setTextColor(6, 95, 70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const initial = (name || 'K').trim().charAt(0).toUpperCase();
  doc.text(initial, x + w / 2, y + h / 2 + 1.5, { align: 'center' });
}
