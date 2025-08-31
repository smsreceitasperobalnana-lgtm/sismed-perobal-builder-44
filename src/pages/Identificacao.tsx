
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, FileText, Users, Stethoscope, Heart, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ProfessionalData {
  type: string;
  name: string;
  registry: string;
  specialty: string;
  healthUnit: string;
  rememberData: boolean;
}

const Identificacao = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfessionalData>({
    type: '',
    name: '',
    registry: '',
    specialty: '',
    healthUnit: '',
    rememberData: false
  });

  useEffect(() => {
    // Verificar se há dados salvos
    const savedData = localStorage.getItem('sismed-professional');
    if (savedData) {
      const professional = JSON.parse(savedData);
      setFormData(professional);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.name || !formData.healthUnit) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.type !== 'VISITANTE' && !formData.registry) {
      toast.error('Código do conselho de classe é obrigatório para profissionais');
      return;
    }

    if (formData.type === 'MÉDICO' && !formData.specialty) {
      toast.error('Especialidade é obrigatória para médicos');
      return;
    }

    // Converter nome para maiúsculo
    const professionalData = {
      ...formData,
      name: formData.name.toUpperCase()
    };

    // Salvar dados na sessão (sempre)
    sessionStorage.setItem('sismed-current-professional', JSON.stringify(professionalData));
    
    // Salvar dados permanentemente se solicitado
    if (professionalData.rememberData) {
      localStorage.setItem('sismed-professional', JSON.stringify(professionalData));
    }

    toast.success('Identificação realizada com sucesso!');
    navigate('/');
  };

  const getProfessionalIcon = (type: string) => {
    switch (type) {
      case 'MÉDICO': return <Stethoscope className="h-5 w-5" />;
      case 'ENFERMEIRO': return <Heart className="h-5 w-5" />;
      case 'FISIOTERAPEUTA': return <Users className="h-5 w-5" />;
      case 'VISITANTE': return <UserCheck className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRegistryLabel = (type: string) => {
    switch (type) {
      case 'MÉDICO': return 'CRM';
      case 'ENFERMEIRO': return 'COREN';
      case 'FISIOTERAPEUTA': return 'CREFITO';
      default: return 'Registro';
    }
  };

  const shouldShowSpecialty = () => {
    return formData.type && formData.type !== 'VISITANTE';
  };

  const isSpecialtyRequired = () => {
    return formData.type === 'MÉDICO';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 to-medical-warning/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 mb-4">
            <img 
              src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" 
              alt="Prefeitura de Perobal" 
              className="h-16"
            />
            <img 
              src="/lovable-uploads/013137d0-d9de-4ac8-b7de-d43bb3463c78.png" 
              alt="SISMED" 
              className="h-16"
            />
          </div>
          <h1 className="text-3xl font-bold text-medical-primary mb-2">
            SISMED Perobal
          </h1>
          <p className="text-gray-600">
            Sistema de Saúde Municipal de Perobal
          </p>
        </div>

        <Card className="medical-card shadow-lg">
          <CardHeader className="medical-card-header text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <FileText className="h-6 w-6 text-medical-primary" />
              Identificação Profissional
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Identifique-se para acessar o sistema
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="medical-form-group">
                <Label className="medical-form-label">Tipo de Profissional *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value, registry: '', specialty: '' })}
                >
                  <SelectTrigger className="border-2 border-medical-warning">
                    <SelectValue placeholder="Selecione o tipo de profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MÉDICO">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Médico
                      </div>
                    </SelectItem>
                    <SelectItem value="ENFERMEIRO">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Enfermeiro(a)
                      </div>
                    </SelectItem>
                    <SelectItem value="FISIOTERAPEUTA">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Fisioterapeuta
                      </div>
                    </SelectItem>
                    <SelectItem value="VISITANTE">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Visitante
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="medical-form-group">
                <Label className="medical-form-label">Nome Completo *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite seu nome completo"
                  className="border-2 border-medical-warning"
                />
              </div>

              {formData.type && formData.type !== 'VISITANTE' && (
                <div className="medical-form-group">
                  <Label className="medical-form-label">
                    {getRegistryLabel(formData.type)} *
                  </Label>
                  <Input
                    type="text"
                    value={formData.registry}
                    onChange={(e) => setFormData({ ...formData, registry: e.target.value })}
                    placeholder={`Digite o número do ${getRegistryLabel(formData.type)}`}
                    className="border-2 border-medical-warning"
                  />
                </div>
              )}

              {shouldShowSpecialty() && (
                <div className="medical-form-group">
                  <Label className="medical-form-label">
                    Especialidade {isSpecialtyRequired() ? '*' : ''}
                  </Label>
                  <Input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Digite sua especialidade"
                    className="border-2 border-medical-warning"
                  />
                </div>
              )}

              <div className="medical-form-group">
                <Label className="medical-form-label">Unidade de Saúde *</Label>
                <Input
                  type="text"
                  value={formData.healthUnit}
                  onChange={(e) => setFormData({ ...formData, healthUnit: e.target.value })}
                  placeholder="Nome da unidade de saúde"
                  className="border-2 border-medical-warning"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberData}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, rememberData: checked as boolean })
                  }
                />
                <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Lembrar dados para próximo acesso
                </Label>
              </div>

              <Button type="submit" className="w-full btn-medical-primary">
                <Building2 className="h-4 w-4 mr-2" />
                Acessar Sistema
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-4">
          Esta identificação é apenas informativa, não é necessário login ou senha.
        </p>
      </div>
    </div>
  );
};

export default Identificacao;
