
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from '@/types';
import { formatCNS } from '@/utils/cnsValidation';

interface AtestadoRapidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Patient | null;
  profissional: any;
}

const motivosComuns = [
  "Consulta médica",
  "Tratamento médico",
  "Repouso médico",
  "Procedimento médico",
  "Acompanhamento médico",
  "Exames médicos"
];

export function AtestadoRapidoModal({ isOpen, onClose, paciente, profissional }: AtestadoRapidoModalProps) {
  const [dias, setDias] = useState('');
  const [cid, setCid] = useState('');
  const [motivo, setMotivo] = useState('');

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getFullYear() - birth.getFullYear();
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

  const gerarAtestadoPDF = () => {
    if (!paciente || !profissional) {
      alert("Erro: Paciente ou profissional não identificado.");
      return;
    }
    
    if (!dias || !motivo) {
      alert("Por favor, preencha os campos obrigatórios (dias e motivo).");
      return;
    }

    const newWindow = window.open('', '_blank');
    if (!newWindow) return;

    const dataAtual = new Date();
    const dataInicio = new Date();
    const dataFim = new Date();
    dataFim.setDate(dataFim.getDate() + parseInt(dias) - 1);

    const formatarData = (data: Date) => {
      return data.toLocaleDateString('pt-BR');
    };

    const atestadoHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Atestado Médico</title>
        <style>
          @page { size: A4; margin: 2cm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 12px; background: white; color: black; line-height: 1.4; }
          
          .atestado-container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            border: 2px solid #1e40af;
            border-radius: 10px;
          }
          
          .header { 
            text-align: center; 
            border-bottom: 2px solid #1e40af; 
            padding-bottom: 15px; 
            margin-bottom: 20px;
          }
          
          .logo-section { 
            display: flex; 
            justify-content: center; 
            align-items: center;
            gap: 15px; 
            margin-bottom: 10px; 
          }
          .logo-section img { height: 40px; }
          .institution-name { 
            color: #1e40af; 
            font-size: 14px; 
            font-weight: bold; 
          }
          .title { color: #1e40af; font-size: 18px; font-weight: bold; margin-top: 10px; }
          .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
          
          .professional-info { 
            background: #f8f9fa; 
            padding: 10px; 
            border: 1px solid #1e40af;
            border-radius: 5px; 
            margin-bottom: 15px;
            font-size: 12px;
          }
          
          .patient-info { 
            background: #f8f9fa; 
            padding: 10px; 
            border: 1px solid #1e40af;
            border-radius: 5px; 
            margin-bottom: 20px;
            font-size: 12px;
          }
          
          .atestado-content { 
            margin: 20px 0;
            font-size: 13px;
            line-height: 1.6;
            text-align: justify;
          }
          
          .footer { 
            margin-top: 40px;
            text-align: center;
          }
          
          .signature-line { 
            border-bottom: 1px solid #000; 
            width: 300px; 
            margin: 30px auto 10px;
          }
          
          .unidade-info {
            text-align: center;
            color: #1e40af;
            font-size: 12px;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="atestado-container">
          <div class="header">
            <div class="logo-section">
              <img src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" alt="Prefeitura" />
              <div class="institution-name">SECRETARIA MUNICIPAL DE SAÚDE</div>
            </div>
            <div class="unidade-info">${profissional?.healthUnit || 'Unidade de Saúde Municipal'}</div>
            <div class="title">ATESTADO MÉDICO</div>
            <div class="subtitle">${formatDateToPerobal(dataAtual)}</div>
          </div>

          <div class="professional-info">
            <strong>Profissional:</strong> ${profissional?.name || 'Não identificado'} — ${profissional?.registry || 'N/A'}
          </div>

          <div class="patient-info">
            <strong>Paciente:</strong> ${paciente.name}<br>
            <strong>CNS:</strong> ${formatCNS(paciente.cns)} — <strong>Idade:</strong> ${calculateAge(paciente.birthDate)} anos
          </div>

          <div class="atestado-content">
            <p>Atesto, para os devidos fins, que o(a) paciente acima identificado(a) esteve sob meus cuidados médicos, necessitando de afastamento de suas atividades por <strong>${dias} ${parseInt(dias) === 1 ? 'dia' : 'dias'}</strong>.</p>
            
            <p style="margin-top: 15px;"><strong>Período:</strong> ${formatarData(dataInicio)} a ${formatarData(dataFim)}</p>
            
            <p style="margin-top: 15px;"><strong>Motivo:</strong> ${motivo}</p>
            
            ${cid ? `<p style="margin-top: 15px;"><strong>CID-10:</strong> ${cid}</p>` : ''}
          </div>

          <div class="footer">
            <div class="signature-line"></div>
            <div style="margin-top: 10px; font-size: 12px;">
              ${profissional?.name || 'Profissional não identificado'}<br>
              ${profissional?.registry || 'N/A'}
            </div>
            <div style="margin-top: 15px; font-size: 11px;">
              ${formatDateToPerobal(dataAtual)}
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

    newWindow.document.write(atestadoHTML);
    newWindow.document.close();
    
    // Limpar campos e fechar modal
    setDias('');
    setCid('');
    setMotivo('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Atestado Rápido</DialogTitle>
          {paciente && (
            <p className="text-sm text-muted-foreground">
              Para: {paciente.name} - CNS: {formatCNS(paciente.cns)}
            </p>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dias" className="text-sm font-medium">
                Dias de Afastamento *
              </Label>
              <Input
                id="dias"
                type="number"
                min="1"
                max="365"
                value={dias}
                onChange={(e) => setDias(e.target.value)}
                placeholder="Ex: 3"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cid" className="text-sm font-medium">
                CID-10 (Opcional)
              </Label>
              <Input
                id="cid"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                placeholder="Ex: Z76.0"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="motivo" className="text-sm font-medium">
              Motivo *
            </Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {motivosComuns.map((motivoItem) => (
                  <SelectItem key={motivoItem} value={motivoItem}>
                    {motivoItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={gerarAtestadoPDF} className="bg-primary hover:bg-primary/90">
            Gerar e Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
