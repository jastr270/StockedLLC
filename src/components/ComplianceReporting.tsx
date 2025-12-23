import React, { useState } from 'react';
import { FileText, Shield, Calendar, CheckCircle, AlertTriangle, Download, Printer, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface ComplianceReportingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ComplianceReport {
  id: string;
  type: 'haccp' | 'health_inspection' | 'supplier_audit' | 'temperature_log' | 'waste_report';
  title: string;
  generatedDate: Date;
  period: string;
  status: 'compliant' | 'non_compliant' | 'needs_review';
  findings: ComplianceFinding[];
  recommendations: string[];
}

interface ComplianceFinding {
  id: string;
  category: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  status: 'open' | 'resolved' | 'in_progress';
  dueDate?: Date;
  assignedTo?: string;
}

export function ComplianceReporting({ isOpen, onClose }: ComplianceReportingProps) {
  const [reports] = useState<ComplianceReport[]>([
    {
      id: 'RPT-001',
      type: 'haccp',
      title: 'HACCP Compliance Report - January 2024',
      generatedDate: new Date(),
      period: 'January 1-31, 2024',
      status: 'compliant',
      findings: [
        {
          id: 'F001',
          category: 'Temperature Control',
          description: 'All refrigeration units maintained proper temperatures',
          severity: 'minor',
          status: 'resolved'
        }
      ],
      recommendations: [
        'Continue current temperature monitoring procedures',
        'Consider upgrading to digital temperature loggers',
        'Schedule quarterly calibration of thermometers'
      ]
    },
    {
      id: 'RPT-002',
      type: 'health_inspection',
      title: 'Health Department Inspection Readiness',
      generatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      period: 'Current Status',
      status: 'needs_review',
      findings: [
        {
          id: 'F002',
          category: 'Food Storage',
          description: 'Some items stored without proper labeling',
          severity: 'major',
          status: 'in_progress',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          assignedTo: 'Kitchen Manager'
        }
      ],
      recommendations: [
        'Implement comprehensive labeling system',
        'Train staff on proper storage procedures',
        'Conduct weekly storage audits'
      ]
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'non_compliant': return 'bg-red-100 text-red-800 border-red-200';
      case 'needs_review': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'major': return 'bg-amber-500 text-white';
      case 'minor': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const generateReport = (type: string) => {
    // Simulate report generation
    console.log(`Generating ${type} report...`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-soft">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Compliance Reporting</h2>
              <p className="text-sm text-gray-600 font-medium">HACCP, health inspections, and regulatory compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            ×
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Report Generation */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { type: 'haccp', label: 'HACCP Report', icon: Shield, color: 'green' },
              { type: 'health_inspection', label: 'Health Inspection', icon: CheckCircle, color: 'blue' },
              { type: 'supplier_audit', label: 'Supplier Audit', icon: Truck, color: 'purple' },
              { type: 'temperature_log', label: 'Temperature Log', icon: Calendar, color: 'amber' },
              { type: 'waste_report', label: 'Waste Report', icon: FileText, color: 'red' }
            ].map(reportType => {
              const Icon = reportType.icon;
              return (
                <button
                  key={reportType.type}
                  onClick={() => generateReport(reportType.type)}
                  className={`p-4 bg-gradient-to-r from-${reportType.color}-50 to-${reportType.color}-100 border-2 border-${reportType.color}-200 rounded-2xl hover:scale-105 transition-all duration-300 shadow-soft text-center`}
                >
                  <Icon className={`w-8 h-8 text-${reportType.color}-600 mx-auto mb-2`} />
                  <p className={`font-bold text-${reportType.color}-800 text-sm`}>{reportType.label}</p>
                </button>
              );
            })}
          </div>

          {/* Existing Reports */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Compliance Reports</h3>
            {reports.map(report => (
              <div key={report.id} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{report.title}</h4>
                    <p className="text-gray-600 font-semibold">{report.period}</p>
                    <p className="text-sm text-gray-500">Generated: {format(report.generatedDate, 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-300">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {report.findings.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Findings ({report.findings.length})</h5>
                    <div className="space-y-2">
                      {report.findings.map(finding => (
                        <div key={finding.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{finding.description}</p>
                            <p className="text-xs text-gray-600">{finding.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(finding.severity)}`}>
                              {finding.severity}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              finding.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              finding.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {finding.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {report.recommendations.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Recommendations</h5>
                    <div className="space-y-1">
                      {report.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-sm text-gray-700 font-medium">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}