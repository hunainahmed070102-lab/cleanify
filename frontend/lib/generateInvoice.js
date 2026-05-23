// Generate Invoice / Job Sheet PDFs using jsPDF
// jsPDF is loaded dynamically (client-only) to avoid SSR crashes

const PRIMARY = [22, 163, 74];   // green-600 #16a34a
const DARK    = [30, 41, 59];    // slate-800
const LIGHT   = [248, 250, 252]; // slate-50

async function getJsPDF() {
  try {
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    return jsPDF;
  } catch (error) {
    console.error('Failed to load jsPDF:', error);
    throw new Error('PDF library not available');
  }
}

// ─── Job Sheet ────────────────────────────────────────────────────────────────
export const generateJobSheetPDF = async (booking) => {
  try {
    const jsPDF = await getJsPDF();
    const doc = new jsPDF();

    // Header
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32); doc.setFont('helvetica', 'bold');
    doc.text('CLEANIFY', 14, 20);
    doc.setFontSize(16); doc.setFont('helvetica', 'normal');
    doc.text('JOB SHEET', 14, 32);
    doc.setFontSize(10);
    doc.text(`Reference: ${booking.id}`, 140, 20);
    doc.text(`Issued: ${new Date(booking.createdAt).toLocaleDateString('en-GB')}`, 140, 27);
    doc.text(`Status: ${booking.status}`, 140, 34);

    // Customer box
    let y = 55;
    doc.setFillColor(...LIGHT);
    doc.roundedRect(14, y, 90, 50, 3, 3, 'F');
    doc.setTextColor(...PRIMARY); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', 18, y + 8);
    doc.setTextColor(...DARK); doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(booking.name || 'N/A', 18, y + 16);
    doc.text(`Phone: ${booking.phone || 'N/A'}`, 18, y + 23);
    doc.text(`Email: ${booking.email || 'N/A'}`, 18, y + 30);
    const addressLines = doc.splitTextToSize(booking.address || 'N/A', 80);
    doc.text(addressLines, 18, y + 37);

    // Service box
    doc.setFillColor(...LIGHT);
    doc.roundedRect(106, y, 90, 50, 3, 3, 'F');
    doc.setTextColor(...PRIMARY); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('SERVICE INFORMATION', 110, y + 8);
    doc.setTextColor(...DARK); doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Category: ${booking.serviceCategory || 'N/A'}`, 110, y + 16);
    doc.text(`Service: ${booking.subService || 'N/A'}`, 110, y + 23);
    doc.text(`Property: ${booking.propertyType || 'N/A'}`, 110, y + 30);
    doc.text(`Rooms: ${booking.rooms || 'N/A'}`, 110, y + 37);

    // Schedule
    y = 113;
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(14, y, 182, 20, 3, 3, 'F');
    doc.setTextColor(...PRIMARY); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text('SCHEDULED SERVICE', 18, y + 8);
    doc.text(`Date: ${new Date(booking.date).toLocaleDateString('en-GB')}  |  Time: ${booking.time}  |  Status: ${booking.status}`, 18, y + 15);

    // Table
    doc.autoTable({
      startY: 140,
      theme: 'grid',
      head: [['Description', 'Details', 'Amount']],
      body: [
        [booking.serviceCategory || 'N/A', booking.subService || 'N/A', `£${booking.totalPrice || 0}`],
        ['Property Type', `${booking.propertyType || 'N/A'} – ${booking.rooms || 0} room(s)`, 'Included'],
        ['Service Date', new Date(booking.date).toLocaleDateString('en-GB'), 'Included'],
      ],
      headStyles: { fillColor: PRIMARY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10, textColor: DARK },
      alternateRowStyles: { fillColor: LIGHT },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 80 }, 2: { cellWidth: 30, halign: 'right' } },
    });

    const finalY = doc.lastAutoTable.finalY + 8;
    doc.setFillColor(...LIGHT);
    doc.roundedRect(130, finalY, 66, 15, 2, 2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(...DARK);
    doc.text('Total Amount:', 135, finalY + 10);
    doc.setTextColor(...PRIMARY); doc.setFontSize(14);
    doc.text(`£${booking.totalPrice || 0}`, 185, finalY + 10, { align: 'right' });

    if (booking.notes) {
      const ny = finalY + 25;
      doc.setFillColor(...LIGHT);
      doc.roundedRect(14, ny, 182, 30, 3, 3, 'F');
      doc.setTextColor(...PRIMARY); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.text('CUSTOMER NOTES', 18, ny + 8);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...DARK);
      const notesLines = doc.splitTextToSize(booking.notes, 175);
      doc.text(notesLines, 18, ny + 15);
    }

    // Footer
    const ph = doc.internal.pageSize.height;
    doc.setFillColor(...PRIMARY);
    doc.rect(0, ph - 18, 210, 18, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(9);
    doc.text('Thank you for choosing Cleanify – Professional Property Services in London', 105, ph - 7, { align: 'center' });

    doc.save(`Cleanify-JobSheet-${booking.id}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('PDF generation failed. Please ensure you have a stable internet connection and try again.');
    return false;
  }
};

// ─── Invoice ──────────────────────────────────────────────────────────────────
export const generateInvoicePDF = async (booking) => {
  try {
    const jsPDF = await getJsPDF();
    const doc = new jsPDF();

    // Header
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28); doc.setFont('helvetica', 'bold');
    doc.text('CLEANIFY', 14, 18);
    doc.setFontSize(14); doc.setFont('helvetica', 'normal');
    doc.text('SERVICE INVOICE', 14, 28);
    doc.setFontSize(10);
    doc.text(`Invoice #: ${booking.id}`, 140, 18);
    doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString('en-GB')}`, 140, 25);
    doc.text(`Status: ${booking.status}`, 140, 32);

    // Bill To
    let y = 50;
    doc.setTextColor(...DARK);
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, y);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(booking.name || 'N/A',    14, y + 9);
    doc.text(booking.email || 'N/A',   14, y + 16);
    doc.text(booking.phone || 'N/A',   14, y + 23);
    const addressLines = doc.splitTextToSize(booking.address || 'N/A', 80);
    doc.text(addressLines, 14, y + 30);

    // Service details
    doc.setFont('helvetica', 'bold');
    doc.text('Service Details:', 110, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Category: ${booking.serviceCategory || 'N/A'}`, 110, y + 9);
    doc.text(`Service: ${booking.subService || 'N/A'}`,        110, y + 16);
    doc.text(`Property: ${booking.propertyType || 'N/A'}`,     110, y + 23);
    doc.text(`Rooms: ${booking.rooms || 'N/A'}`,               110, y + 30);
    doc.setFont('helvetica', 'bold');
    doc.text('Scheduled:', 110, y + 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(booking.date).toLocaleDateString('en-GB')}`, 110, y + 48);
    doc.text(`Time: ${booking.time}`, 110, y + 55);

    // Table
    doc.autoTable({
      startY: 115,
      theme: 'grid',
      head: [['Description', 'Details', 'Amount']],
      body: [
        [booking.serviceCategory || 'N/A', booking.subService || 'N/A', `£${booking.totalPrice || 0}`],
        ['Property Type', `${booking.propertyType || 'N/A'} – ${booking.rooms || 0} room(s)`, 'Included'],
        ['Service Date', new Date(booking.date).toLocaleDateString('en-GB'), 'Included'],
      ],
      headStyles: { fillColor: PRIMARY, textColor: 255, fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10, textColor: DARK },
      alternateRowStyles: { fillColor: LIGHT },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 80 }, 2: { cellWidth: 30, halign: 'right' } },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(...LIGHT);
    doc.rect(130, finalY, 66, 15, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(...DARK);
    doc.text('Total Amount:', 135, finalY + 10);
    doc.setTextColor(...PRIMARY); doc.setFontSize(14);
    doc.text(`£${booking.totalPrice || 0}`, 185, finalY + 10, { align: 'right' });

    // Payment terms
    const ty = finalY + 28;
    doc.setTextColor(...DARK); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text('Payment Terms:', 14, ty);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
    doc.text('• Payment is due after service completion', 14, ty + 8);
    doc.text('• Pay only when fully satisfied with the work', 14, ty + 14);
    doc.text('• 24/7 support available via WhatsApp', 14, ty + 20);

    if (booking.notes) {
      const ny = ty + 32;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...DARK);
      doc.text('Additional Notes:', 14, ny);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
      const notesLines = doc.splitTextToSize(booking.notes, 180);
      doc.text(notesLines, 14, ny + 7);
    }

    // Footer
    const ph = doc.internal.pageSize.height;
    doc.setFillColor(...PRIMARY);
    doc.rect(0, ph - 18, 210, 18, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(9);
    doc.text('Thank you for choosing Cleanify – Professional Property Services in London', 105, ph - 7, { align: 'center' });

    doc.save(`Cleanify-Invoice-${booking.id}.pdf`);
    return true;
  } catch (error) {
    console.error('Invoice generation failed:', error);
    alert('Invoice generation failed. Please ensure you have a stable internet connection and try again.');
    return false;
  }
};
