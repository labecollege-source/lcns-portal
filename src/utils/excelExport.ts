import { Student, PaymentRecord } from '../types/college';

/**
 * Trigger browser file download from Blob
 */
function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string | number | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate Excel XML Workbook for Students Collection
 */
export function exportStudentsToExcel(students: Student[], collegeName = 'Labe College of Nursing Sciences, Gboko') {
  const dateStr = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toLocaleTimeString();

  let rowsXml = '';
  students.forEach((s, idx) => {
    rowsXml += `
      <Row>
        <Cell><Data ss:Type="Number">${idx + 1}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.admissionNumber)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.fullName)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.gender)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.programmeName)}</Data></Cell>
        <Cell><Data ss:Type="Number">${s.level}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.currentSession)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.currentSemester)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.email)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.phone)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.parentPhone)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.accommodationStatus)}</Data></Cell>
        <Cell><Data ss:Type="Number">${s.totalFeesRequired}</Data></Cell>
        <Cell><Data ss:Type="Number">${s.totalFeesPaid}</Data></Cell>
        <Cell><Data ss:Type="Number">${s.outstandingBalance}</Data></Cell>
        <Cell><Data ss:Type="String">${s.financialClearance ? 'CLEARED' : 'OWING ARREARS'}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.createdAt)}</Data></Cell>
      </Row>
    `;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="HeaderTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#064E3B"/>
   <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SubTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Italic="1" ss:Color="#374151"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#064E3B"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#065F46" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Firestore Students">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="140"/>
   <Column ss:Width="180"/>
   <Column ss:Width="70"/>
   <Column ss:Width="180"/>
   <Column ss:Width="60"/>
   <Column ss:Width="90"/>
   <Column ss:Width="80"/>
   <Column ss:Width="180"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="100"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="100"/>
   
   <Row ss:Height="30">
    <Cell ss:MergeAcross="16" ss:StyleID="HeaderTitle">
     <Data ss:Type="String">${escapeXml(collegeName)} - FIRESTORE STUDENTS REGISTRY</Data>
    </Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:MergeAcross="16" ss:StyleID="SubTitle">
     <Data ss:Type="String">Export Generated: ${dateStr} ${timeStr} | Source: Firebase Firestore collection 'students' | Total Records: ${students.length}</Data>
    </Cell>
   </Row>
   <Row ss:Height="8"/>
   <Row ss:Height="25" ss:StyleID="TableHeader">
    <Cell><Data ss:Type="String">S/N</Data></Cell>
    <Cell><Data ss:Type="String">Matric / Admission No</Data></Cell>
    <Cell><Data ss:Type="String">Full Name</Data></Cell>
    <Cell><Data ss:Type="String">Gender</Data></Cell>
    <Cell><Data ss:Type="String">Academic Programme</Data></Cell>
    <Cell><Data ss:Type="String">Level</Data></Cell>
    <Cell><Data ss:Type="String">Session</Data></Cell>
    <Cell><Data ss:Type="String">Semester</Data></Cell>
    <Cell><Data ss:Type="String">Email Address</Data></Cell>
    <Cell><Data ss:Type="String">Student Phone</Data></Cell>
    <Cell><Data ss:Type="String">Parent/Guardian Phone</Data></Cell>
    <Cell><Data ss:Type="String">Accommodation</Data></Cell>
    <Cell><Data ss:Type="String">Required Fees (NGN)</Data></Cell>
    <Cell><Data ss:Type="String">Fees Paid (NGN)</Data></Cell>
    <Cell><Data ss:Type="String">Outstanding Balance (NGN)</Data></Cell>
    <Cell><Data ss:Type="String">Clearance Status</Data></Cell>
    <Cell><Data ss:Type="String">Date Enrolled</Data></Cell>
   </Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

  downloadFile(xmlContent, `LCNS_Firestore_Students_${dateStr}.xls`, 'application/vnd.ms-excel');
}

/**
 * Generate Excel XML Workbook for Payments Collection
 */
export function exportPaymentsToExcel(payments: PaymentRecord[], collegeName = 'Labe College of Nursing Sciences, Gboko') {
  const dateStr = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toLocaleTimeString();

  let rowsXml = '';
  payments.forEach((p, idx) => {
    rowsXml += `
      <Row>
        <Cell><Data ss:Type="Number">${idx + 1}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.receiptNumber)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.reference)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.payerName)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.payerEmail)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.admissionOrAppNumber)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.payerType.toUpperCase())}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.paymentType.replace('_', ' ').toUpperCase())}</Data></Cell>
        <Cell><Data ss:Type="Number">${p.amount}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.session)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.semester || 'N/A')}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.gateway.toUpperCase())}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.status.toUpperCase())}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.createdAt)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.verifiedAt || p.createdAt)}</Data></Cell>
      </Row>
    `;
  });

  const totalAmount = payments.reduce((sum, p) => (p.status === 'success' ? sum + p.amount : sum), 0);

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="HeaderTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#1E3A8A"/>
   <Interior ss:Color="#DBEAFE" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SubTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Italic="1" ss:Color="#374151"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1E3A8A"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E40AF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TotalRow">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1" ss:Color="#064E3B"/>
   <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Firestore Payments">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="130"/>
   <Column ss:Width="150"/>
   <Column ss:Width="180"/>
   <Column ss:Width="190"/>
   <Column ss:Width="150"/>
   <Column ss:Width="90"/>
   <Column ss:Width="130"/>
   <Column ss:Width="120"/>
   <Column ss:Width="90"/>
   <Column ss:Width="80"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="130"/>
   <Column ss:Width="130"/>
   
   <Row ss:Height="30">
    <Cell ss:MergeAcross="14" ss:StyleID="HeaderTitle">
     <Data ss:Type="String">${escapeXml(collegeName)} - FIRESTORE PAYMENTS LEDGER</Data>
    </Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:MergeAcross="14" ss:StyleID="SubTitle">
     <Data ss:Type="String">Export Generated: ${dateStr} ${timeStr} | Source: Firebase Firestore collection 'payments' | Total Transactions: ${payments.length} | Verified Revenue: NGN ${totalAmount.toLocaleString()}</Data>
    </Cell>
   </Row>
   <Row ss:Height="8"/>
   <Row ss:Height="25" ss:StyleID="TableHeader">
    <Cell><Data ss:Type="String">S/N</Data></Cell>
    <Cell><Data ss:Type="String">Receipt Number</Data></Cell>
    <Cell><Data ss:Type="String">Transaction Ref</Data></Cell>
    <Cell><Data ss:Type="String">Payer Name</Data></Cell>
    <Cell><Data ss:Type="String">Payer Email</Data></Cell>
    <Cell><Data ss:Type="String">Matric / App No</Data></Cell>
    <Cell><Data ss:Type="String">Payer Type</Data></Cell>
    <Cell><Data ss:Type="String">Payment Type</Data></Cell>
    <Cell><Data ss:Type="String">Amount (NGN)</Data></Cell>
    <Cell><Data ss:Type="String">Session</Data></Cell>
    <Cell><Data ss:Type="String">Semester</Data></Cell>
    <Cell><Data ss:Type="String">Gateway</Data></Cell>
    <Cell><Data ss:Type="String">Status</Data></Cell>
    <Cell><Data ss:Type="String">Created At</Data></Cell>
    <Cell><Data ss:Type="String">Verified At</Data></Cell>
   </Row>
   ${rowsXml}
   <Row ss:Height="24" ss:StyleID="TotalRow">
    <Cell ss:MergeAcross="7"><Data ss:Type="String">TOTAL VERIFIED COLLECTION</Data></Cell>
    <Cell><Data ss:Type="Number">${totalAmount}</Data></Cell>
    <Cell ss:MergeAcross="5"><Data ss:Type="String">Audited By Bursary &amp; ICT Administration</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  downloadFile(xmlContent, `LCNS_Firestore_Payments_${dateStr}.xls`, 'application/vnd.ms-excel');
}

/**
 * Generate Master Combined Excel Workbook (Multi-Sheet: Summary, Students, Payments)
 */
export function exportCombinedMasterExcel(
  students: Student[],
  payments: PaymentRecord[],
  collegeName = 'Labe College of Nursing Sciences, Gboko'
) {
  const dateStr = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toLocaleTimeString();

  const totalCollected = payments.reduce((sum, p) => (p.status === 'success' ? sum + p.amount : sum), 0);
  const totalFeesRequired = students.reduce((sum, s) => sum + s.totalFeesRequired, 0);
  const totalFeesPaid = students.reduce((sum, s) => sum + s.totalFeesPaid, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.outstandingBalance, 0);
  const clearedStudents = students.filter((s) => s.financialClearance).length;

  let studentsRowsXml = '';
  students.forEach((s, idx) => {
    studentsRowsXml += `
      <Row>
        <Cell><Data ss:Type="Number">${idx + 1}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.admissionNumber)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.fullName)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.programmeName)}</Data></Cell>
        <Cell><Data ss:Type="Number">${s.level}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.currentSession)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.phone)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.parentPhone)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(s.accommodationStatus)}</Data></Cell>
        <Cell><Data ss:Type="Number">${s.totalFeesRequired}</Data></Cell>
        <Cell><Data ss:Type="Number">${s.totalFeesPaid}</Data></Cell>
        <Cell><Data ss:Type="Number">${s.outstandingBalance}</Data></Cell>
        <Cell><Data ss:Type="String">${s.financialClearance ? 'CLEARED' : 'OWING'}</Data></Cell>
      </Row>
    `;
  });

  let paymentsRowsXml = '';
  payments.forEach((p, idx) => {
    paymentsRowsXml += `
      <Row>
        <Cell><Data ss:Type="Number">${idx + 1}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.receiptNumber)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.reference)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.payerName)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.admissionOrAppNumber)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.paymentType.replace('_', ' ').toUpperCase())}</Data></Cell>
        <Cell><Data ss:Type="Number">${p.amount}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.session)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.status.toUpperCase())}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(p.createdAt)}</Data></Cell>
      </Row>
    `;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Header1">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="ThGreen">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#065F46" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="ThBlue">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E40AF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="KpiLabel">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#334155"/>
  </Style>
  <Style ss:ID="KpiValue">
   <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1" ss:Color="#064E3B"/>
  </Style>
 </Styles>

 <!-- Sheet 1: Executive KPI Summary -->
 <Worksheet ss:Name="Executive Audit Summary">
  <Table ss:DefaultRowHeight="22">
   <Column ss:Width="260"/>
   <Column ss:Width="220"/>
   <Row ss:Height="30">
    <Cell ss:MergeAcross="1" ss:StyleID="Header1">
     <Data ss:Type="String">${escapeXml(collegeName)} - FIRESTORE MASTER REPORT</Data>
    </Cell>
   </Row>
   <Row><Cell ss:MergeAcross="1"><Data ss:Type="String">Generated: ${dateStr} ${timeStr} | Confidential Internal Record</Data></Cell></Row>
   <Row ss:Height="10"/>
   <Row>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Total Students Enrolled</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${students.length}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Financially Cleared Students</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${clearedStudents}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Students with Outstanding Arrears</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${students.length - clearedStudents}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Total School Fees Demanded (NGN)</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${totalFeesRequired}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Total Student Fees Paid (NGN)</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${totalFeesPaid}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Total Outstanding Student Arrears (NGN)</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${totalOutstanding}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Total Bursary Payment Transactions Recorded</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${payments.length}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Total Verified Gateway Inflow (NGN)</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${totalCollected}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>

 <!-- Sheet 2: Students Collection -->
 <Worksheet ss:Name="Students Collection">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="140"/>
   <Column ss:Width="180"/>
   <Column ss:Width="180"/>
   <Column ss:Width="60"/>
   <Column ss:Width="90"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="100"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="100"/>
   <Row ss:Height="25" ss:StyleID="ThGreen">
    <Cell><Data ss:Type="String">S/N</Data></Cell>
    <Cell><Data ss:Type="String">Matric No</Data></Cell>
    <Cell><Data ss:Type="String">Full Name</Data></Cell>
    <Cell><Data ss:Type="String">Programme</Data></Cell>
    <Cell><Data ss:Type="String">Level</Data></Cell>
    <Cell><Data ss:Type="String">Session</Data></Cell>
    <Cell><Data ss:Type="String">Phone</Data></Cell>
    <Cell><Data ss:Type="String">Parent Phone</Data></Cell>
    <Cell><Data ss:Type="String">Accommodation</Data></Cell>
    <Cell><Data ss:Type="String">Fees Required (NGN)</Data></Cell>
    <Cell><Data ss:Type="String">Fees Paid (NGN)</Data></Cell>
    <Cell><Data ss:Type="String">Balance (NGN)</Data></Cell>
    <Cell><Data ss:Type="String">Status</Data></Cell>
   </Row>
   ${studentsRowsXml}
  </Table>
 </Worksheet>

 <!-- Sheet 3: Payments Collection -->
 <Worksheet ss:Name="Payments Collection">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="130"/>
   <Column ss:Width="150"/>
   <Column ss:Width="180"/>
   <Column ss:Width="150"/>
   <Column ss:Width="130"/>
   <Column ss:Width="120"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="130"/>
   <Row ss:Height="25" ss:StyleID="ThBlue">
    <Cell><Data ss:Type="String">S/N</Data></Cell>
    <Cell><Data ss:Type="String">Receipt No</Data></Cell>
    <Cell><Data ss:Type="String">Reference</Data></Cell>
    <Cell><Data ss:Type="String">Payer Name</Data></Cell>
    <Cell><Data ss:Type="String">Matric / App No</Data></Cell>
    <Cell><Data ss:Type="String">Payment Type</Data></Cell>
    <Cell><Data ss:Type="String">Amount (NGN)</Data></Cell>
    <Cell><Data ss:Type="String">Session</Data></Cell>
    <Cell><Data ss:Type="String">Status</Data></Cell>
    <Cell><Data ss:Type="String">Date</Data></Cell>
   </Row>
   ${paymentsRowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

  downloadFile(xmlContent, `LCNS_Master_Ledger_${dateStr}.xls`, 'application/vnd.ms-excel');
}

/**
 * Standard CSV Export for Students
 */
export function exportStudentsToCsv(students: Student[]) {
  const headers = [
    'S/N',
    'Matric No',
    'Full Name',
    'Gender',
    'Programme',
    'Level',
    'Session',
    'Semester',
    'Email',
    'Phone',
    'Parent Phone',
    'Accommodation',
    'Total Fees Required',
    'Total Fees Paid',
    'Outstanding Balance',
    'Clearance Status',
    'Registration Date',
  ];

  const rows = students.map((s, idx) => [
    idx + 1,
    `"${s.admissionNumber}"`,
    `"${s.fullName}"`,
    s.gender,
    `"${s.programmeName}"`,
    s.level,
    `"${s.currentSession}"`,
    `"${s.currentSemester}"`,
    `"${s.email}"`,
    `"${s.phone}"`,
    `"${s.parentPhone}"`,
    `"${s.accommodationStatus}"`,
    s.totalFeesRequired,
    s.totalFeesPaid,
    s.outstandingBalance,
    s.financialClearance ? 'Cleared' : 'Owing Fees',
    `"${s.createdAt}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(csv, `LCNS_Firestore_Students_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Standard CSV Export for Payments
 */
export function exportPaymentsToCsv(payments: PaymentRecord[]) {
  const headers = [
    'S/N',
    'Receipt Number',
    'Reference',
    'Payer Name',
    'Payer Email',
    'Matric / App No',
    'Payer Type',
    'Payment Category',
    'Amount (NGN)',
    'Session',
    'Semester',
    'Gateway',
    'Status',
    'Created At',
    'Verified At',
  ];

  const rows = payments.map((p, idx) => [
    idx + 1,
    `"${p.receiptNumber}"`,
    `"${p.reference}"`,
    `"${p.payerName}"`,
    `"${p.payerEmail}"`,
    `"${p.admissionOrAppNumber}"`,
    p.payerType,
    `"${p.paymentType}"`,
    p.amount,
    `"${p.session}"`,
    `"${p.semester || 'N/A'}"`,
    p.gateway,
    p.status,
    `"${p.createdAt}"`,
    `"${p.verifiedAt || ''}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(csv, `LCNS_Firestore_Payments_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}


/**
 * Open a print-ready student registry. In the browser print dialog choose
 * "Save as PDF" to download an actual PDF without adding another runtime dependency.
 */
export function exportStudentsToPDF(
  students: Student[],
  collegeName = 'Labe College of Nursing Sciences, Gboko'
) {
  const dateStr = new Date().toLocaleDateString('en-NG');
  const rows = students.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeXml(s.admissionNumber)}</td>
      <td>${escapeXml(s.fullName)}</td>
      <td>${escapeXml(s.gender)}</td>
      <td>${escapeXml(s.programmeName)}</td>
      <td>${s.level}</td>
      <td>${escapeXml(s.currentSession)}</td>
      <td>${escapeXml(s.currentSemester)}</td>
      <td>${escapeXml(s.email)}</td>
      <td>${escapeXml(s.phone)}</td>
      <td>₦${Number(s.totalFeesPaid || 0).toLocaleString('en-NG')}</td>
      <td>₦${Number(s.outstandingBalance || 0).toLocaleString('en-NG')}</td>
      <td>${s.financialClearance ? 'CLEARED' : 'PENDING'}</td>
    </tr>
  `).join('');

  const w = window.open('', '_blank', 'width=1200,height=800');
  if (!w) {
    alert('Please allow pop-ups for the portal to generate the PDF.');
    return;
  }
  w.document.write(`<!doctype html><html><head><title>LCNS Student Registry</title>
    <style>
      body{font-family:Arial,sans-serif;padding:28px;color:#0f172a}
      h1{font-size:20px;margin:0 0 4px;color:#064e3b}
      p{font-size:11px;color:#475569;margin:4px 0 18px}
      table{width:100%;border-collapse:collapse;font-size:8px}
      th,td{border:1px solid #cbd5e1;padding:5px;text-align:left}
      th{background:#064e3b;color:#fff}
      .footer{margin-top:18px;font-size:9px;color:#64748b}
      @media print{@page{size:landscape;margin:10mm}}
    </style></head><body>
    <h1>${escapeXml(collegeName)} — STUDENT INFORMATION REGISTRY</h1>
    <p>Generated: ${dateStr} &nbsp; | &nbsp; Total Students: ${students.length}</p>
    <table><thead><tr>
      <th>S/N</th><th>Admission No</th><th>Full Name</th><th>Gender</th><th>Programme</th>
      <th>Level</th><th>Session</th><th>Semester</th><th>Email</th><th>Phone</th>
      <th>Fees Paid</th><th>Outstanding</th><th>Financial Status</th>
    </tr></thead><tbody>${rows}</tbody></table>
    <div class="footer">Official LCNS Registry Export — Provost Office</div>
    <script>window.onload=()=>{window.print();}</script>
    </body></html>`);
  w.document.close();
}
