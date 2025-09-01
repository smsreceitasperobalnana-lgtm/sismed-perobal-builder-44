import React, { useState, useEffect } from 'react';
import { FileText, User, Pill, ArrowRight, ArrowLeft, Printer, History, FileCheck } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatCNS } from '@/utils/cnsValidation';
import { Patient, Medication, PrescriptionMedication, Prescription } from '@/types';
import { AtestadoRapidoModal } from '@/components/AtestadoRapidoModal';

const Receitas = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [prescriptionMonths, setPrescriptionMonths] = useState('1');
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [medicationPosologies, setMedicationPosologies] = useState<{[key: string]: string}>({});
  const [observations, setObservations] = useState('');
  const [professional, setProfessional] = useState<any>(null);
  const [isAtestadoModalOpen, setIsAtestadoModalOpen] = useState(false);

  const [patients] = useLocalStorage<Patient[]>('sismed-patients', []);
  const [medications] = useLocalStorage<Medication[]>('sismed-medications', []);
  const [prescriptions, setPrescriptions] = useLocalStorage<Prescription[]>('sismed-prescriptions', []);

  useEffect(() => {
    // Carregar dados do profissional da sessão
    const professionalData = sessionStorage.getItem('sismed-current-professional');
    if (professionalData) {
      setProfessional(JSON.parse(professionalData));
    }
  }, []);

  // Filtrar receitas da sessão atual (últimas 10)
  const currentSessionPrescriptions = prescriptions.slice(-10).reverse();

  const handleMedicationToggle = (medicationId: string) => {
    setSelectedMedications(prev => 
      prev.includes(medicationId)
        ? prev.filter(id => id !== medicationId)
        : [...prev, medicationId]
    );
  };

  const handlePosologyChange = (medicationId: string, posology: string) => {
    setMedicationPosologies(prev => ({
      ...prev,
      [medicationId]: posology
    }));
  };

  const goToStep2 = () => {
    if (!selectedPatient) {
      toast.error('Selecione um paciente');
      return;
    }
    if (selectedMedications.length === 0) {
      toast.error('Selecione pelo menos um medicamento');
      return;
    }
    setCurrentStep(2);
  };

  const openAtestadoModal = () => {
    if (!selectedPatient) {
      toast.error('Selecione um paciente primeiro');
      return;
    }
    setIsAtestadoModalOpen(true);
  };

  const generatePrescriptions = () => {
    const controlledMeds = selectedMedications
      .map(id => medications.find(m => m.id === id))
      .filter(med => med?.isControlled);
    
    const missingPosology = controlledMeds.some(med => 
      !medicationPosologies[med!.id] || medicationPosologies[med!.id].trim() === ''
    );

    if (missingPosology) {
      toast.error('Medicamentos controlados devem ter posologia preenchida');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient)!;
    const prescriptionMeds: PrescriptionMedication[] = selectedMedications.map(id => ({
      medication: medications.find(m => m.id === id)!,
      posology: medicationPosologies[id] || 'Conforme orientação médica'
    }));

    const monthsNum = parseInt(prescriptionMonths);
    const baseDate = new Date();
    
    // Generate multiple prescriptions for each month
    for (let month = 0; month < monthsNum; month++) {
      const prescriptionDate = new Date(baseDate);
      prescriptionDate.setDate(prescriptionDate.getDate() + (30 * month));
      
      const prescription: Prescription = {
        id: `RX${Date.now()}-${month + 1}`,
        patientId: patient.id,
        patientName: patient.name,
        patientCNS: patient.cns,
        medications: prescriptionMeds,
        months: 1, // Each prescription is for 1 month
        observations: observations,
        date: prescriptionDate.toISOString(),
        professionalName: professional?.name || 'Profissional não identificado'
      };

      setPrescriptions(prev => [...prev, prescription]);
    }

    // Generate single PDF with all prescriptions
    setTimeout(() => {
      generateMultiplePrescriptionsPDF(patient, prescriptionMeds, baseDate, monthsNum);
    }, 100);

    toast.success(`${monthsNum} receita(s) gerada(s) com sucesso!`);
    
    // Reset form
    setCurrentStep(1);
    setSelectedPatient('');
    setSelectedMedications([]);
    setMedicationPosologies({});
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

  const reprintPrescription = (prescription: Prescription) => {
    const patient = patients.find(p => p.id === prescription.patientId);
    if (!patient) {
      toast.error('Paciente não encontrado');
      return;
    }

    const prescriptionDate = new Date(prescription.date);
    generateSinglePrescriptionPDF(patient, prescription.medications, prescriptionDate, prescription.observations);
  };

  const calculateMedicationsPerPage = () => {
    // Cálculo conservador: garantir que todos os medicamentos caibam em uma página
    // Espaço fixo: cabeçalho (120px) + info profissional (60px) + info paciente (60px) + 
    // observações (80px) + rodapé (100px) + margens e espaçamentos (80px) = ~500px
    const fixedHeight = 500;
    const medicationHeight = 45; // Altura estimada por medicamento
    const availableHeight = 650; // Altura útil da página A4 landscape (menor para ser conservador)
    const maxMedications = Math.floor((availableHeight - fixedHeight) / medicationHeight);
    
    // Garantir pelo menos 3 medicamentos por página, máximo 8 para segurança
    return Math.max(3, Math.min(8, maxMedications));
  };

  const splitMedicationsIntoPages = (medications: PrescriptionMedication[]) => {
    const medicationsPerPage = calculateMedicationsPerPage();
    const pages: PrescriptionMedication[][] = [];
    
    for (let i = 0; i < medications.length; i += medicationsPerPage) {
      pages.push(medications.slice(i, i + medicationsPerPage));
    }
    
    return pages;
  };

  const generateSinglePrescriptionPDF = (
    patient: Patient, 
    medications: PrescriptionMedication[], 
    prescriptionDate: Date,
    observations: string
  ) => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) return;

    const calculateAge = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      return today.getFullYear() - birth.getFullYear();
    };

    const medicationPages = splitMedicationsIntoPages(medications);

    const generateViaHTML = (viaType: string, pageNum?: number, totalPages?: number) => `
      <div class="prescription-via">
        <div class="via-label">${viaType}</div>
        
        <div class="header">
          <div class="logo-section">
            <img src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" alt="Prefeitura" />
            <div class="institution-name">SECRETARIA MUNICIPAL DE SAÚDE</div>
          </div>
          <div class="title">SISTEMA DE SAÚDE MUNICIPAL DE PEROBAL</div>
          <div class="subtitle">RECEITUÁRIO${totalPages && totalPages > 1 ? ` - PÁGINA ${pageNum} DE ${totalPages}` : ''}</div>
        </div>

        <div class="professional-info">
          <strong>Profissional:</strong> ${professional?.name || 'Não identificado'} — ${professional?.registry || 'N/A'}
        </div>

        <div class="patient-info">
          <strong>Nome:</strong> ${patient.name}<br>
          <strong>CNS:</strong> ${formatCNS(patient.cns)} — <strong>Idade:</strong> ${calculateAge(patient.birthDate)} anos
        </div>

        <div class="prescription-date">
          <strong>Data:</strong> ${formatDateToPerobal(prescriptionDate)}
        </div>

        <div class="medications">
          <strong>Medicamentos Prescritos:</strong>
          ${(pageNum ? medicationPages[pageNum - 1] : medications).map(item => `
            <div class="medication-item">
              <div class="medication-name">
                ${item.medication.name} ${item.medication.dosage} - ${item.medication.presentation}
                ${item.medication.isControlled ? '<span class="controlled-badge">CONTROLADO</span>' : ''}
              </div>
              <div class="medication-posology">${item.posology}</div>
            </div>
          `).join('')}
        </div>

        ${observations && pageNum === 1 ? `<div class="observations"><strong>Observações:</strong><br>${observations}</div>` : ''}

        <div class="footer">
          <div class="signature-line"></div>
          <div style="text-align: center; margin-top: 5px;">
            ${professional?.name || 'Profissional não identificado'} — ${professional?.registry || 'N/A'}
          </div>
          <div style="text-align: center; margin-top: 10px; font-size: 11px;">
            ${formatDateToPerobal(prescriptionDate)}
          </div>
        </div>
      </div>
    `;

    let prescriptionHTML = '';
    
    if (medicationPages.length === 1) {
      prescriptionHTML = `
        <div class="prescription-container">
          ${generateViaHTML('VIA DA FARMÁCIA')}
          ${generateViaHTML('VIA DO PACIENTE')}
        </div>
      `;
    } else {
      // Generate multiple pages - cada página é completa e independente
      prescriptionHTML = medicationPages.map((_, pageIndex) => `
        <div class="prescription-page">
          <div class="prescription-container">
            ${generateViaHTML('VIA DA FARMÁCIA', pageIndex + 1, medicationPages.length)}
            ${generateViaHTML('VIA DO PACIENTE', pageIndex + 1, medicationPages.length)}
          </div>
        </div>
      `).join('');
    }

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receituário</title>
        <style>
          @page { size: A4 landscape; margin: 0.8cm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 12px; background: white; color: black; }
          
          .prescription-page {
            page-break-after: always;
            height: 100vh;
            width: 100%;
          }
          
          .prescription-page:last-child {
            page-break-after: auto;
          }
          
          .prescription-container { 
            display: flex; 
            gap: 8px; 
            height: 100%; 
            width: 100%;
          }
          
          .prescription-via { 
            flex: 1; 
            border: 2px solid #fbbf24; 
            padding: 15px; 
            background: white;
            position: relative;
            height: 100%;
            overflow: hidden;
          }
          
          .prescription-via:first-child::after {
            content: '';
            position: absolute;
            right: -4px;
            top: 0;
            bottom: 0;
            width: 2px;
            border-right: 2px dashed #666;
          }
          
          .via-label { 
            position: absolute;
            top: 8px;
            right: 12px;
            font-weight: bold; 
            color: #1e40af; 
            font-size: 9pt;
          }
          
          .header { 
            text-align: center; 
            border-bottom: 2px solid #1e40af; 
            padding-bottom: 12px; 
            margin-bottom: 15px;
            margin-top: 20px;
          }
          
          .logo-section { 
            display: flex; 
            justify-content: center; 
            align-items: center;
            gap: 12px; 
            margin-bottom: 8px; 
          }
          .logo-section img { height: 35px; }
          .institution-name { 
            color: #1e40af; 
            font-size: 13px; 
            font-weight: bold; 
          }
          .title { color: #1e40af; font-size: 16px; font-weight: bold; }
          .subtitle { color: #666; font-size: 12px; margin-top: 4px; }
          
          .professional-info, .patient-info, .prescription-date { 
            background: #f8f9fa; 
            padding: 8px; 
            border: 1px solid #fbbf24;
            border-radius: 4px; 
            margin-bottom: 12px;
            font-size: 11px;
          }
          
          .medications { 
            margin-bottom: 15px;
            flex-grow: 1;
            overflow: hidden;
          }
          .medication-item { 
            padding: 6px; 
            border-bottom: 1px solid #eee; 
            margin-bottom: 6px;
          }
          .medication-name { font-weight: bold; color: black; font-size: 11px; }
          .medication-posology { margin-top: 3px; font-style: italic; font-size: 10px; }
          
          .controlled-badge { 
            background: #fca5a5; 
            color: #991b1b; 
            border: 1px solid #f87171;
            padding: 1px 4px; 
            border-radius: 2px; 
            font-size: 8px;
            margin-left: 8px;
          }
          
          .observations { 
            margin-bottom: 15px; 
            padding: 8px; 
            background: #f8f9fa; 
            border: 1px solid #fbbf24; 
            border-radius: 4px;
            font-size: 10px;
          }
          
          .footer { 
            margin-top: auto;
            padding-top: 12px;
            border-top: 1px solid #fbbf24;
          }
          
          .signature-line { 
            border-bottom: 1px solid #000; 
            width: 250px; 
            margin: 20px auto 8px;
          }
        </style>
      </head>
      <body>
        ${prescriptionHTML}
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

  const generateMultiplePrescriptionsPDF = (
    patient: Patient, 
    medications: PrescriptionMedication[], 
    baseDate: Date,
    totalMonths: number
  ) => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) return;

    const calculateAge = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      return today.getFullYear() - birth.getFullYear();
    };

    const medicationPages = splitMedicationsIntoPages(medications);

    const generateSinglePrescriptionHTML = (prescriptionDate: Date, monthNumber: number) => {
      const generateViaHTML = (viaType: string, pageNum?: number, totalPages?: number) => `
        <div class="prescription-via">
          <div class="via-label">${viaType}</div>
          
          <div class="header">
            <div class="logo-section">
              <img src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" alt="Prefeitura" />
              <div class="institution-name">SECRETARIA MUNICIPAL DE SAÚDE</div>
            </div>
            <div class="title">SISTEMA DE SAÚDE MUNICIPAL DE PEROBAL</div>
            <div class="subtitle">RECEITUÁRIO${totalMonths > 1 ? ` - ${monthNumber}ª VIA DE ${totalMonths}` : ''}${totalPages && totalPages > 1 ? ` - PÁGINA ${pageNum} DE ${totalPages}` : ''}</div>
          </div>

          <div class="professional-info">
            <strong>Profissional:</strong> ${professional?.name || 'Não identificado'} — ${professional?.registry || 'N/A'}
          </div>

          <div class="patient-info">
            <strong>Nome:</strong> ${patient.name}<br>
            <strong>CNS:</strong> ${formatCNS(patient.cns)} — <strong>Idade:</strong> ${calculateAge(patient.birthDate)} anos
          </div>

          <div class="prescription-date">
            <strong>Data:</strong> ${formatDateToPerobal(prescriptionDate)}
          </div>

          <div class="medications">
            <strong>Medicamentos Prescritos:</strong>
            ${(pageNum ? medicationPages[pageNum - 1] : medications).map(item => `
              <div class="medication-item">
                <div class="medication-name">
                  ${item.medication.name} ${item.medication.dosage} - ${item.medication.presentation}
                  ${item.medication.isControlled ? '<span class="controlled-badge">CONTROLADO</span>' : ''}
                </div>
                <div class="medication-posology">${item.posology}</div>
              </div>
            `).join('')}
          </div>

          ${observations && pageNum === 1 ? `<div class="observations"><strong>Observações:</strong><br>${observations}</div>` : ''}

          <div class="footer">
            <div class="signature-line"></div>
            <div style="text-align: center; margin-top: 5px;">
              ${professional?.name || 'Profissional não identificado'} — ${professional?.registry || 'N/A'}
            </div>
            <div style="text-align: center; margin-top: 10px; font-size: 11px;">
              ${formatDateToPerobal(prescriptionDate)}
            </div>
          </div>
        </div>
      `;

      if (medicationPages.length === 1) {
        return `
          <div class="prescription-page">
            <div class="prescription-container">
              ${generateViaHTML('VIA DA FARMÁCIA')}
              ${generateViaHTML('VIA DO PACIENTE')}
            </div>
          </div>
        `;
      } else {
        return medicationPages.map((_, pageIndex) => `
          <div class="prescription-page">
            <div class="prescription-container">
              ${generateViaHTML('VIA DA FARMÁCIA', pageIndex + 1, medicationPages.length)}
              ${generateViaHTML('VIA DO PACIENTE', pageIndex + 1, medicationPages.length)}
            </div>
          </div>
        `).join('');
      }
    };

    // Generate all prescriptions HTML
    let allPrescriptionsHTML = '';
    for (let month = 0; month < totalMonths; month++) {
      const prescriptionDate = new Date(baseDate);
      prescriptionDate.setDate(prescriptionDate.getDate() + (30 * month));
      allPrescriptionsHTML += generateSinglePrescriptionHTML(prescriptionDate, month + 1);
    }

    const prescriptionHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receituários - ${totalMonths} ${totalMonths === 1 ? 'Via' : 'Vias'}</title>
        <style>
          @page { size: A4 landscape; margin: 0.8cm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 12px; background: white; color: black; }
          
          .prescription-page {
            page-break-after: always;
            height: 100vh;
            width: 100%;
          }
          
          .prescription-page:last-child {
            page-break-after: auto;
          }
          
          .prescription-container { 
            display: flex; 
            gap: 8px; 
            height: 100%; 
            width: 100%;
          }
          
          .prescription-via { 
            flex: 1; 
            border: 2px solid #fbbf24; 
            padding: 15px; 
            background: white;
            position: relative;
            height: 100%;
            overflow: hidden;
          }
          
          .prescription-via:first-child::after {
            content: '';
            position: absolute;
            right: -4px;
            top: 0;
            bottom: 0;
            width: 2px;
            border-right: 2px dashed #666;
          }
          
          .via-label { 
            position: absolute;
            top: 8px;
            right: 12px;
            font-weight: bold; 
            color: #1e40af; 
            font-size: 9pt;
          }
          
          .header { 
            text-align: center; 
            border-bottom: 2px solid #1e40af; 
            padding-bottom: 12px; 
            margin-bottom: 15px;
            margin-top: 20px;
          }
          
          .logo-section { 
            display: flex; 
            justify-content: center; 
            align-items: center;
            gap: 12px; 
            margin-bottom: 8px; 
          }
          .logo-section img { height: 35px; }
          .institution-name { 
            color: #1e40af; 
            font-size: 13px; 
            font-weight: bold; 
          }
          .title { color: #1e40af; font-size: 16px; font-weight: bold; }
          .subtitle { color: #666; font-size: 12px; margin-top: 4px; }
          
          .professional-info, .patient-info, .prescription-date { 
            background: #f8f9fa; 
            padding: 8px; 
            border: 1px solid #fbbf24;
            border-radius: 4px; 
            margin-bottom: 12px;
            font-size: 11px;
          }
          
          .medications { 
            margin-bottom: 15px;
            flex-grow: 1;
            overflow: hidden;
          }
          .medication-item { 
            padding: 6px; 
            border-bottom: 1px solid #eee; 
            margin-bottom: 6px;
          }
          .medication-name { font-weight: bold; color: black; font-size: 11px; }
          .medication-posology { margin-top: 3px; font-style: italic; font-size: 10px; }
          
          .controlled-badge { 
            background: #fca5a5; 
            color: #991b1b; 
            border: 1px solid #f87171;
            padding: 1px 4px; 
            border-radius: 2px; 
            font-size: 8px;
            margin-left: 8px;
          }
          
          .observations { 
            margin-bottom: 15px; 
            padding: 8px; 
            background: #f8f9fa; 
            border: 1px solid #fbbf24; 
            border-radius: 4px;
            font-size: 10px;
          }
          
          .footer { 
            margin-top: auto;
            padding-top: 12px;
            border-top: 1px solid #fbbf24;
          }
          
          .signature-line { 
            border-bottom: 1px solid #000; 
            width: 250px; 
            margin: 20px auto 8px;
          }
        </style>
      </head>
      <body>
        ${allPrescriptionsHTML}
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    newWindow.document.write(prescriptionHTML);
    newWindow.document.close();
  };

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Emissão de Receituários
            </h1>
            <p className="text-muted-foreground mt-1">
              Prescreva medicamentos e gere receituários múltiplos
            </p>
          </div>
          
          {/* Botão de Atalho para Atestado Rápido */}
          {selectedPatient && (
            <Button
              onClick={openAtestadoModal}
              variant="outline"
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Atestado Rápido
            </Button>
          )}
        </div>

        {/* History Section */}
        {currentSessionPrescriptions.length > 0 && (
          <Card className="medical-card">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-medical-primary" />
                Histórico desta Sessão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentSessionPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{prescription.patientName}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {new Date(prescription.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reprintPrescription(prescription)}
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

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step-item">
            <div className={`step-number ${currentStep >= 1 ? 'active' : 'inactive'}`}>1</div>
            <span className="text-sm font-medium text-foreground">Seleção</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="step-item">
            <div className={`step-number ${currentStep >= 2 ? 'active' : 'inactive'}`}>2</div>
            <span className="text-sm font-medium text-foreground">Posologia</span>
          </div>
        </div>

        {/* Step 1: Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
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
                      <SelectTrigger className="border-2 border-medical-warning">
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

                  <div className="medical-form-group">
                    <Label className="medical-form-label">Quantidade de Meses</Label>
                    <Select value={prescriptionMonths} onValueChange={setPrescriptionMonths}>
                      <SelectTrigger className="border-2 border-medical-warning">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map(month => (
                          <SelectItem key={month} value={month.toString()}>
                            {month} {month === 1 ? 'mês' : 'meses'}
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

            {/* Medication Selection */}
            <Card className="medical-card">
              <CardHeader className="medical-card-header">
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-medical-primary" />
                  Seleção de Medicamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medications.map(medication => {
                    const isSelected = selectedMedications.includes(medication.id);

                    return (
                      <div
                        key={medication.id}
                        onClick={() => handleMedicationToggle(medication.id)}
                        className={`
                          flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                          ${isSelected
                            ? 'bg-primary text-white border-blue-700 shadow-lg'
                            : 'border-blue-200 text-foreground hover:bg-dark hover:text-white hover:border-dark'
                          }
                        `}
                      >
                        <Checkbox
                          id={medication.id}
                          checked={isSelected}
                          readOnly
                          className="pointer-events-none"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-base">
                            {medication.name} {medication.dosage}
                          </span>
                          <p className={`text-sm ${isSelected ? 'text-blue-100' : 'text-muted-foreground'}`}>
                            {medication.presentation}
                            {medication.isControlled && (
                              <span className="ml-2 bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                CONTROLADO
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={goToStep2} className="btn-medical-primary">
                    Definir Posologia
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Posology */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="medical-card">
              <CardHeader className="medical-card-header">
                <CardTitle>Definir Posologia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMedications.map(medicationId => {
                  const medication = medications.find(m => m.id === medicationId)!;
                  return (
                    <div key={medicationId} className="p-4 border-2 border-medical-warning rounded-lg bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-semibold text-foreground">
                          {medication.name} {medication.dosage} - {medication.presentation}
                        </h4>
                        {medication.isControlled && (
                          <span className="controlled-badge">
                            CONTROLADO
                          </span>
                        )}
                      </div>
                      <div className="medical-form-group">
                        <Label className="medical-form-label">
                          Posologia {medication.isControlled ? '*' : ''}
                        </Label>
                        <Input
                          value={medicationPosologies[medicationId] || ''}
                          onChange={(e) => handlePosologyChange(medicationId, e.target.value)}
                          placeholder="Ex: 1 comprimido de 8 em 8 horas por 7 dias"
                          className="border-2 border-medical-warning"
                          required={medication.isControlled}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="medical-form-group">
                  <Label className="medical-form-label">Observações Gerais</Label>
                  <Textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Observações adicionais para o paciente..."
                    className="border-2 border-medical-warning"
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button onClick={generatePrescriptions} className="btn-medical-success">
                    <Printer className="h-4 w-4 mr-2" />
                    Gerar {prescriptionMonths} Receituário{parseInt(prescriptionMonths) > 1 ? 's' : ''}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal do Atestado Rápido */}
        <AtestadoRapidoModal
          isOpen={isAtestadoModalOpen}
          onClose={() => setIsAtestadoModalOpen(false)}
          paciente={selectedPatientData || null}
          profissional={professional}
        />
      </div>
    </Layout>
  );
};

export default Receitas;
