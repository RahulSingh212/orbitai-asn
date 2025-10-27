import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import type { University } from '../types';

const getAdmissionChance = (uni: University): number => {
  return typeof uni.admission_chance === 'string'
    ? parseFloat(uni.admission_chance)
    : uni.admission_chance;
};

export const exportToPDF = (universities: University[], userProfile?: {
  gmat_score: number;
  gpa: number;
  work_experience: number;
  target_program: string;
}) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('OrbitAI - University Match Report', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  
  if (userProfile) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Your Profile:', 14, 38);
    
    doc.setFontSize(10);
    doc.text(`GMAT Score: ${userProfile.gmat_score}`, 14, 45);
    doc.text(`GPA: ${userProfile.gpa.toFixed(2)}`, 14, 51);
    doc.text(`Work Experience: ${userProfile.work_experience} years`, 14, 57);
    doc.text(`Target Program: ${userProfile.target_program}`, 14, 63);
  }
  
  const safety = universities.filter(u => getAdmissionChance(u) >= 60).length;
  const target = universities.filter(u => getAdmissionChance(u) >= 35 && getAdmissionChance(u) < 60).length;
  const reach = universities.filter(u => getAdmissionChance(u) < 35).length;
  
  const startY = userProfile ? 73 : 38;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Match Summary:', 14, startY);
  
  doc.setFontSize(10);
  doc.text(`Total Matches: ${universities.length}`, 14, startY + 7);
  doc.text(`Safety Schools (60%+): ${safety}`, 14, startY + 13);
  doc.text(`Target Schools (35-60%): ${target}`, 14, startY + 19);
  doc.text(`Reach Schools (<35%): ${reach}`, 14, startY + 25);
  
  const tableStartY = startY + 35;
  
  const tableData = universities.map((uni, index) => {
    const chance = getAdmissionChance(uni);
    const tier = chance >= 60 ? 'Safety' : chance >= 35 ? 'Target' : 'Reach';
    
    return [
      index + 1,
      uni.university,
      `${chance.toFixed(1)}%`,
      tier,
      uni.program_stats.avg_gmat,
      uni.program_stats.avg_gpa.toFixed(2),
      `${uni.program_stats.acceptance_rate}%`,
      uni.tuition_cost ? `$${(uni.tuition_cost / 1000).toFixed(0)}k` : 'N/A',
    ];
  });
  
  autoTable(doc, {
    head: [['#', 'University', 'Admission %', 'Tier', 'Avg GMAT', 'Avg GPA', 'Accept %', 'Tuition']],
    body: tableData,
    startY: tableStartY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 50 },
      2: { cellWidth: 20 },
      3: { cellWidth: 18 },
      4: { cellWidth: 20 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18 },
      7: { cellWidth: 20 },
    },
  });
  
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      '© 2025 OrbitAI - Right Fit Matcher',
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  doc.save(`OrbitAI-University-Matches-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToCSV = (universities: University[]) => {
  const csvData = universities.map((uni, index) => {
    const chance = getAdmissionChance(uni);
    const tier = chance >= 60 ? 'Safety' : chance >= 35 ? 'Target' : 'Reach';
    
    return {
      Rank: index + 1,
      University: uni.university,
      'Admission Chance (%)': chance.toFixed(1),
      Tier: tier,
      Location: uni.location || 'N/A',
      Ranking: uni.ranking || 'N/A',
      'Avg GMAT': uni.program_stats.avg_gmat,
      'Avg GPA': uni.program_stats.avg_gpa.toFixed(2),
      'Acceptance Rate (%)': uni.program_stats.acceptance_rate,
      'Avg Work Experience (years)': uni.program_stats.avg_work_experience || 'N/A',
      'Annual Tuition ($)': uni.tuition_cost || 'N/A',
    };
  });
  
  const csv = Papa.unparse(csvData);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `OrbitAI-University-Matches-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printResults = () => {
  window.print();
};

