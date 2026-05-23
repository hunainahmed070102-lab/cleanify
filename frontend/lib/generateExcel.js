import * as XLSX from 'xlsx';

/**
 * Generate and download Excel file for a booking
 * @param {Object} booking - The booking object
 * @param {string} type - 'invoice' or 'jobsheet'
 */
export const generateBookingExcel = (booking, type = 'invoice') => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare data for the worksheet
    const data = [
      ['CLEANIFY'],
      ['Professional Cleaning Services'],
      [''],
      [type === 'invoice' ? 'INVOICE' : 'JOB SHEET'],
      [''],
      ['Booking ID:', booking.id],
      ['Date:', new Date(booking.createdAt).toLocaleDateString('en-GB')],
      ['Status:', booking.status],
      [''],
      ['CUSTOMER DETAILS'],
      ['Name:', booking.name],
      ['Phone:', booking.phone],
      ['Email:', booking.email],
      ['Address:', booking.address],
      ['Postcode:', booking.postcode || 'N/A'],
      [''],
      ['SERVICE DETAILS'],
      ['Service Category:', booking.serviceCategory],
      ['Sub-Service:', booking.subService],
      ['Property Type:', booking.propertyType],
      ['Number of Rooms:', booking.rooms],
    ];

    // Add area if available
    if (booking.area) {
      data.push(['Area (sq ft):', booking.area]);
    }

    // Add schedule details
    data.push(
      [''],
      ['SCHEDULE'],
      ['Service Date:', new Date(booking.date).toLocaleDateString('en-GB')],
      ['Service Time:', booking.time],
      ['']
    );

    // Add notes if available
    if (booking.notes) {
      data.push(
        ['ADDITIONAL NOTES'],
        [booking.notes],
        ['']
      );
    }

    // Add pricing
    data.push(
      ['PRICING'],
      ['Total Amount:', `£${booking.totalPrice}`],
      [''],
      [''],
      ['Thank you for choosing Cleanify!'],
      ['For any queries, please contact us at support@cleanify.com']
    );

    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
      { wch: 25 }, // Column A
      { wch: 40 }  // Column B
    ];

    // Merge cells for headers
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // CLEANIFY
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }, // Subtitle
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, // INVOICE/JOB SHEET
    ];

    // Apply styles (basic formatting)
    // Note: XLSX free version has limited styling, but we can set basic properties
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, type === 'invoice' ? 'Invoice' : 'Job Sheet');

    // Generate filename
    const filename = `Cleanify_${type === 'invoice' ? 'Invoice' : 'JobSheet'}_${booking.id}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Write and download the file
    XLSX.writeFile(wb, filename);

    return true;
  } catch (error) {
    console.error('Excel generation error:', error);
    throw new Error('Failed to generate Excel file. Please try again.');
  }
};

/**
 * Generate Invoice Excel
 */
export const generateInvoiceExcel = (booking) => {
  return generateBookingExcel(booking, 'invoice');
};

/**
 * Generate Job Sheet Excel
 */
export const generateJobSheetExcel = (booking) => {
  return generateBookingExcel(booking, 'jobsheet');
};
