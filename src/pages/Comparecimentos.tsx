import React, { useState, useEffect } from 'react';
import { FileCheck, User, Calendar, Clock, Printer, History } from 'lucide-react';
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
import { Patient, AttendanceCertificate } from '@/types';

const Comparecimentos = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [attendanceTime, setAttendanceTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [purpose, setPurpose] = useState('');
  const [observations, setObservations] = useState('');
  const [professional, setProfessional] = useState<any>(null);

  const [patients] = useLocalStorage<Patient[]>('sismed-patients', []);
  const [attendances, setAttendances] = useLocalStorage<AttendanceCertificate[]>('sismed-attendances', []);
  // Ler a cor de destaque das configurações
  const [config] = useLocalStorage<any>('sismed-config', { accentBorder: 'warning' });
  const borderClass = `border-2 border-medical-${config?.accentBorder || 'warning'}`;

  useEffect(() => {
    const professionalData = sessionStorage.getItem('sismed-current-professional');
    if (professionalData) {
      setProfessional(JSON.parse(professionalData));
    }
  }, []);

  // Filtrar comprovantes da sessão atual (últimos 10)
  const currentSessionAttendances = attendances.slice(-10).reverse();

  const generateAttendanceCertificate = () => {
    if (!selectedPatient) {
      toast.error('Selecione um paciente');
      return;
    }
    if (!attendanceDate) {
      toast.error('Selecione a data do comparecimento');
      return;
    }
    if (!attendanceTime) {
      toast.error('Informe o horário do comparecimento');
      return;
    }
    if (!purpose.trim()) {
      toast.error('Informe o motivo do comparecimento');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient)!;

    const attendance: AttendanceCertificate = {
      id: `ATT${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      patientCNS: patient.cns,
      attendanceDate,
      attendanceTime,
      duration,
      purpose,
      observations,
      date: new Date().toISOString(),
      professionalName: professional?.name || 'Profissional não identificado'
    };

    setAttendances(prev => [...prev, attendance]);

    // Generate PDF
    setTimeout(() => {
      generateAttendancePDF(patient, attendance);
    }, 100);

    toast.success('Comprovante de comparecimento gerado com sucesso!');
    
    // Reset form
    setSelectedPatient('');
    setAttendanceDate('');
    setAttendanceTime('');
    setDuration('30');
    setPurpose('');
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

  const generateAttendancePDF = (patient: Patient, attendance: AttendanceCertificate) => {
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

    const formatTime = (timeStr: string) => {
      return timeStr;
    };

    const certificateDate = new Date(attendance.date);

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comprovante de Comparecimento</title>
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
          
          .attendance-details {
            background: #f0f9ff;
            padding: 20px;
            border-left: 4px solid #0284c7;
            border-radius: 8px;
            margin: 30px 0;
          }
          
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
            border-bottom: 1px solid #e0e7ff;
          }
          
          .detail-row:last-child {
            border-bottom: none;
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
            <div class="title">COMPROVANTE DE COMPARECIMENTO</div>
          </div>

          <div class="professional-info">
            <strong>Profissional:</strong> ${professional?.name || 'Não identificado'} — ${professional?.registry || 'N/A'}
          </div>

          <div class="certificate-content">
            <p>Atesto, para os devidos fins, que o(a) paciente <span class="patient-highlight">${patient.name}</span>, 
            portador(a) do CNS <strong>${formatCNS(patient.cns)}</strong>, com <strong>${calculateAge(patient.birthDate)} anos</strong> de idade, 
            compareceu a esta unidade de saúde conforme detalhes abaixo:</p>
          </div>

          <div class="attendance-details">
            <div class="detail-row">
              <strong>Data do Comparecimento:</strong>
              <span>${formatDate(attendance.attendanceDate)}</span>
            </div>
            <div class="detail-row">
              <strong>Horário:</strong>
              <span>${formatTime(attendance.attendanceTime)}</span>
            </div>
            <div class="detail-row">
              <strong>Duração Aproximada:</strong>
              <span>${attendance.duration} minutos</span>
            </div>
            <div class="detail-row">
              <strong>Finalidade:</strong>
              <span>${attendance.purpose}</span>
            </div>
          </div>

          ${attendance.observations ? `
            <div class="observations">
              <strong>Observações:</strong><br>
              ${attendance.observations}
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

  const reprintAttendance = (attendance: AttendanceCertificate) => {
    const patient = patients.find(p => p.id === attendance.patientId);
    if (!patient) {
      toast.error('Paciente não encontrado');
      return;
    }

    generateAttendancePDF(patient, attendance);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Comprovantes de Comparecimento
            </h1>
            <p className="text-muted-foreground mt-1">
              Gere comprovantes de comparecimento para consultas e procedimentos
            </p>
          </div>
        </div>

        {/* History Section */}
        {currentSessionAttendances.length > 0 && (
          <Card className="medical-card">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-medical-primary" />
                Histórico desta Sessão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentSessionAttendances.map((attendance) => (
                  <div key={attendance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{attendance.patientName}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {new Date(attendance.attendanceDate).toLocaleDateString('pt-BR')} às {attendance.attendanceTime}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reprintAttendance(attendance)}
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
              <div className="space-y-4">
                <div className="medical-form-group">
                  <Label className="medical-form-label">Nome do Paciente</Label>
                  <Input
                    placeholder="Digite o nome do paciente..."
                    className={borderClass}
                  />
                </div>
                <div className="medical-form-group">
                  <Label className="medical-form-label">Paciente Cadastrado</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className={borderClass}>
                      <SelectValue placeholder="Ou selecione um paciente cadastrado" />
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

        {/* Attendance Details */}
        <Card className="medical-card">
          <CardHeader className="medical-card-header">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-medical-primary" />
              Dados do Comparecimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="medical-form-group">
                <Label className="medical-form-label">Data do Comparecimento *</Label>
                <Input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className={borderClass}
                  required
                />
              </div>

              <div className="medical-form-group">
                <Label className="medical-form-label">Horário *</Label>
                <Input
                  type="time"
                  value={attendanceTime}
                  onChange={(e) => setAttendanceTime(e.target.value)}
                  className={borderClass}
                  required
                />
              </div>

              <div className="medical-form-group">
                <Label className="medical-form-label">Duração (minutos)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className={borderClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 30, 45, 60, 90, 120, 180].map(mins => (
                      <SelectItem key={mins} value={mins.toString()}>
                        {mins} minutos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="medical-form-group">
              <Label className="medical-form-label">Finalidade do Comparecimento *</Label>
              <Textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Ex: Consulta médica de rotina, Procedimento ambulatorial, Acompanhamento terapêutico"
                className={borderClass}
                rows={3}
                required
              />
            </div>

            <div className="medical-form-group">
              <Label className="medical-form-label">Observações Adicionais</Label>
              <Textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Observações adicionais sobre o comparecimento..."
                className={borderClass}
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={generateAttendanceCertificate} className="btn-medical-success">
                <Printer className="h-4 w-4 mr-2" />
                Gerar Comprovante
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Comparecimentos;
