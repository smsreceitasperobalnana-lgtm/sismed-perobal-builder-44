import React, { useState, useEffect } from 'react';
import { FileText, User, Calendar, Clock, Printer, History } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatCNS } from '@/utils/cnsValidation';
import { Patient, MedicalCertificate } from '@/types';

const Atestados = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [daysOff, setDaysOff] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [reason, setReason] = useState('');
  const [cid, setCid] = useState('');
  const [observations, setObservations] = useState('');
  const [professional, setProfessional] = useState<any>(null);

  const [patients] = useLocalStorage<Patient[]>('sismed-patients', []);
  const [certificates, setCertificates] = useLocalStorage<MedicalCertificate[]>('sismed-certificates', []);
  // Ler a cor de destaque das configurações
  const [config] = useLocalStorage<any>('sismed-config', { accentBorder: 'warning' });
  const borderClass = `border-2 border-medical-${config?.accentBorder || 'warning'}`;

  useEffect(() => {
    const professionalData = sessionStorage.getItem('sismed-current-professional');
    if (professionalData) {
      setProfessional(JSON.parse(professionalData));
    }
  }, []);

  // Filtrar atestados da sessão atual (últimos 10)
  const currentSessionCertificates = certificates.slice(-10).reverse();

  const calculateEndDate = (start: string, days: number) => {
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days - 1);
    return endDate.toISOString().split('T')[0];
  };

  const generateCertificate = () => {
    if (!selectedPatient) {
      toast.error('Selecione um paciente');
      return;
    }
    if (!startDate) {
      toast.error('Selecione a data de início');
      return;
    }
    if (!reason.trim()) {
      toast.error('Informe o motivo do afastamento');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient)!;
    const days = parseInt(daysOff);
    const endDate = calculateEndDate(startDate, days);

    const certificate: MedicalCertificate = {
      id: `CERT${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      patientCNS: patient.cns,
      daysOff: days,
      startDate,
      endDate,
      reason,
      cid,
      observations,
      date: new Date().toISOString(),
      professionalName: professional?.name || 'Profissional não identificado'
    };

    setCertificates(prev => [...prev, certificate]);

    // Generate PDF
    setTimeout(() => {
      generateCertificatePDF(patient, certificate);
    }, 100);

    toast.success('Atestado médico gerado com sucesso!');
    
    // Reset form
    setSelectedPatient('');
    setDaysOff('1');
    setStartDate('');
    setReason('');
    setCid('');
    setObservations('');
  };

  const formatDateToPerobal = (date: Date) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `Perobal, dia ${day} de ${month} de ${year}`;
  };

  const generateCertificatePDF = (patient: Patient, certificate: MedicalCertificate) => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) return;

    const calculateAge = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      return today.getFullYear() - birth.getFullYear();
    };

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    };

    const certificateDate = new Date(certificate.date);

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Atestado Médico</title>
        <style>
          @page { size: A4; margin: 2cm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 14px; background: white; color: black; line-height: 1.6; }
          
          .certificate-container { 
            width: 100%; 
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            min-height: 100vh;
          }
          
          .header { 
            text-align: center; 
            border-bottom: 3px solid #1e40af; 
            padding-bottom: 20px; 
            margin-bottom: 40px;
          }
          
          .logo-section { 
            display: flex; 
            justify-content: center; 
            align-items: center;
            gap: 20px; 
            margin-bottom: 15px; 
          }
          .logo-section img { height: 60px; }
          .institution-name { 
            color: #1e40af; 
            font-size: 18px; 
            font-weight: bold; 
          }
          .title { color: #1e40af; font-size: 24px; font-weight: bold; margin-top: 10px; }
          
          .professional-info { 
            background: #f8f9fa; 
            padding: 15px; 
            border: 2px solid #fbbf24;
            border-radius: 8px; 
            margin-bottom: 30px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
          }
          
          .certificate-content {
            font-size: 16px;
            line-height: 2;
            text-align: justify;
            margin-bottom: 40px;
          }
          
          .patient-highlight {
            font-weight: bold;
            text-decoration: underline;
          }
          
          .period-highlight {
            font-weight: bold;
            background: #fffbeb;
            padding: 2px 4px;
            border-radius: 4px;
          }
          
          .cid-section {
            margin: 20px 0;
            padding: 10px;
            background: #f0f9ff;
            border-left: 4px solid #0284c7;
            border-radius: 4px;
          }
          
          .observations {
            margin: 30px 0;
            padding: 15px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
          }
          
          .footer { 
            margin-top: 60px;
            text-align: center;
          }
          
          .signature-section {
            margin-top: 80px;
            text-align: center;
          }
          
          .signature-line { 
            border-bottom: 2px solid #000; 
            width: 400px; 
            margin: 0 auto 15px;
          }
          
          .professional-signature {
            font-weight: bold;
            font-size: 16px;
          }
          
          .date-location {
            text-align: right;
            margin-top: 40px;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="header">
            <div class="logo-section">
              <img src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" alt="Prefeitura" />
              <div class="institution-name">SECRETARIA MUNICIPAL DE SAÚDE</div>
            </div>
            <div class="title">ATESTADO MÉDICO</div>
          </div>

          <div class="professional-info">
            <strong>Profissional:</strong> ${professional?.name || 'Não identificado'} — ${professional?.registry || 'N/A'}
          </div>

          <div class="certificate-content">
            <p>Atesto, para os devidos fins, que o(a) paciente <span class="patient-highlight">${patient.name}</span>, 
            portador(a) do CNS <strong>${formatCNS(patient.cns)}</strong>, com <strong>${calculateAge(patient.birthDate)} anos</strong> de idade, 
            esteve sob meus cuidados médicos e necessita de afastamento de suas atividades habituais.</p>

            <p style="margin-top: 30px;">
            <strong>Período de afastamento:</strong> 
            <span class="period-highlight">
              ${certificate.daysOff === 1 ? 
                `${formatDate(certificate.startDate)}` : 
                `${formatDate(certificate.startDate)} a ${formatDate(certificate.endDate)}`
              }
              (${certificate.daysOff} ${certificate.daysOff === 1 ? 'dia' : 'dias'})
            </span>
            </p>

            <p style="margin-top: 20px;"><strong>Motivo:</strong> ${certificate.reason}</p>

            ${certificate.cid ? `
              <div class="cid-section">
                <strong>CID-10:</strong> ${certificate.cid}
              </div>
            ` : ''}
          </div>

          ${certificate.observations ? `
            <div class="observations">
              <strong>Observações:</strong><br>
              ${certificate.observations}
            </div>
          ` : ''}

          <div class="date-location">
            ${formatDateToPerobal(certificateDate)}
          </div>

          <div class="signature-section">
            <div class="signature-line"></div>
            <div class="professional-signature">
              ${professional?.name || 'Profissional não identificado'}<br>
              ${professional?.registry || 'N/A'}
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    newWindow.document.write(fullHTML);
    newWindow.document.close();
  };

  const reprintCertificate = (certificate: MedicalCertificate) => {
    const patient = patients.find(p => p.id === certificate.patientId);
    if (!patient) {
      toast.error('Paciente não encontrado');
      return;
    }

    generateCertificatePDF(patient, certificate);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Atestados Médicos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gere atestados médicos para afastamento de atividades
            </p>
          </div>
        </div>

        {/* History Section */}
        {currentSessionCertificates.length > 0 && (
          <Card className="medical-card">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-medical-primary" />
                Histórico desta Sessão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentSessionCertificates.map((certificate) => (
                  <div key={certificate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{certificate.patientName}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {new Date(certificate.date).toLocaleDateString('pt-BR')} - {certificate.daysOff} {certificate.daysOff === 1 ? 'dia' : 'dias'}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reprintCertificate(certificate)}
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Reimprimir
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certificate Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Selection */}
          <Card className="medical-card">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-medical-primary" />
                Seleção do Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="medical-form-group">
                <Label className="medical-form-label">Paciente *</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className={borderClass}>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {formatCNS(patient.cns)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Selected Patient Info */}
          {selectedPatient && (
            <Card className="medical-card">
              <CardHeader className="medical-card-header">
                <CardTitle>Dados do Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const patient = patients.find(p => p.id === selectedPatient)!;
                  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
                  return (
                    <div className="space-y-2">
                      <div><strong>Nome:</strong> {patient.name}</div>
                      <div><strong>CNS:</strong> {formatCNS(patient.cns)}</div>
                      <div><strong>Idade:</strong> {age} anos</div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Certificate Details */}
        <Card className="medical-card">
          <CardHeader className="medical-card-header">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-medical-primary" />
              Dados do Atestado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="medical-form-group">
                <Label className="medical-form-label">Dias de Afastamento *</Label>
                <Select value={daysOff} onValueChange={setDaysOff}>
                  <SelectTrigger className={borderClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 10, 15, 30, 45, 60, 90].map(days => (
                      <SelectItem key={days} value={days.toString()}>
                        {days} {days === 1 ? 'dia' : 'dias'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="medical-form-group">
                <Label className="medical-form-label">Data de Início *</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={borderClass}
                  required
                />
              </div>

              <div className="medical-form-group">
                <Label className="medical-form-label">Data de Término</Label>
                <Input
                  type="date"
                  value={startDate ? (() => { const d = new Date(startDate); const e = new Date(d); e.setDate(d.getDate() + parseInt(daysOff) - 1); return e.toISOString().split('T')[0]; })() : ''}
                  className="border-2 border-gray-300 bg-gray-50"
                  disabled
                />
              </div>
            </div>

            <div className="medical-form-group">
              <Label className="medical-form-label">Motivo do Afastamento *</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Repouso médico devido a quadro gripal"
                className={borderClass}
                rows={3}
                required
              />
            </div>

            <div className="medical-form-group">
              <Label className="medical-form-label">CID-10 (Opcional)</Label>
              <Input
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                placeholder="Ex: J06.9"
                className={borderClass}
              />
            </div>

            <div className="medical-form-group">
              <Label className="medical-form-label">Observações Adicionais</Label>
              <Textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Observações adicionais sobre o atestado..."
                className={borderClass}
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={generateCertificate} className="btn-medical-success">
                <Printer className="h-4 w-4 mr-2" />
                Gerar Atestado Médico
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Atestados;
