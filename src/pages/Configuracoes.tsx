import React, { useState } from 'react';
import { Settings, Palette, Image, Download, Upload, Info, Clock, Save } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SystemConfig {
  theme: 'light' | 'dark' | 'blue';
  institutionName: string;
  logoUrl: string;
  autoSave: boolean;
  sessionTimeout: number;
  notifications: boolean;
  accentBorder?: 'warning' | 'primary' | 'success' | 'gray';
}

const Configuracoes = () => {
  const [config, setConfig] = useLocalStorage<SystemConfig>('sismed-config', {
    theme: 'light',
    institutionName: 'Secretaria Municipal de Saúde',
    logoUrl: '/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png',
    autoSave: true,
    sessionTimeout: 30,
    notifications: true,
    accentBorder: 'warning',
  });

  const [patients] = useLocalStorage('sismed-patients', []);
  const [medications] = useLocalStorage('sismed-medications', []);
  const [prescriptions] = useLocalStorage('sismed-prescriptions', []);

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Configuração salva');
  };

  const saveConfig = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const exportData = () => {
    const allData = {
      patients,
      medications, 
      prescriptions,
      config,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sismed-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Backup exportado com sucesso!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.patients) localStorage.setItem('sismed-patients', JSON.stringify(data.patients));
        if (data.medications) localStorage.setItem('sismed-medications', JSON.stringify(data.medications));
        if (data.prescriptions) localStorage.setItem('sismed-prescriptions', JSON.stringify(data.prescriptions));
        if (data.config) setConfig(data.config);
        
        toast.success('Dados importados com sucesso!');
        window.location.reload();
      } catch (error) {
        toast.error('Erro ao importar dados. Verifique o formato do arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('sismed-patients');
      localStorage.removeItem('sismed-medications');  
      localStorage.removeItem('sismed-prescriptions');
      localStorage.removeItem('sismed-config');
      toast.success('Todos os dados foram removidos');
      window.location.reload();
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const logoUrl = e.target?.result as string;
      handleConfigChange('logoUrl', logoUrl);
    };
    reader.readAsDataURL(file);
  };

  const borderClass = `border-2 border-medical-${config.accentBorder || 'warning'}`;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Configurações do Sistema
            </h1>
            <p className="text-muted-foreground mt-1">
              Personalize aparência, dados e configurações avançadas
            </p>
          </div>

          {/* Botão Salvar Configurações */}
          <Button onClick={saveConfig} className="btn-medical-success">
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aparência */}
          <Card className="medical-card">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-medical-primary" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="medical-form-group">
                <Label className="medical-form-label">Tema do Sistema</Label>
                <Select 
                  value={config.theme} 
                  onValueChange={(value) => handleConfigChange('theme', value as SystemConfig['theme'])}
                >
                  <SelectTrigger className={borderClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="blue">Azul Médico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="medical-form-group">
                <Label className="medical-form-label">Cores Personalizadas</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="w-full h-8 bg-medical-primary rounded mb-1"></div>
                    <span className="text-xs">Primária</span>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-8 bg-medical-warning rounded mb-1"></div>
                    <span className="text-xs">Aviso</span>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-8 bg-medical-success rounded mb-1"></div>
                    <span className="text-xs">Sucesso</span>
                  </div>
                </div>
              </div>

              <div className="medical-form-group">
                <Label className="medical-form-label">Cor de Destaque (bordas)</Label>
                <Select
                  value={config.accentBorder || 'warning'}
                  onValueChange={(value) => handleConfigChange('accentBorder', value as NonNullable<SystemConfig['accentBorder']>)}
                >
                  <SelectTrigger className={borderClass}>
                    <SelectValue placeholder="Selecione a cor de destaque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">Amarelo (Aviso)</SelectItem>
                    <SelectItem value="primary">Azul (Primária)</SelectItem>
                    <SelectItem value="success">Verde (Sucesso)</SelectItem>
                    <SelectItem value="gray">Cinza Discreto</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Esta cor será aplicada às bordas dos campos dos formulários.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Logos e Identidade */}
          <Card className="medical-card">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-medical-primary" />
                Logos e Identidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="medical-form-group">
                <Label className="medical-form-label">Nome da Instituição</Label>
                <Input
                  value={config.institutionName}
                  onChange={(e) => handleConfigChange('institutionName', e.target.value)}
                  placeholder="Secretaria Municipal de Saúde"
                  className={borderClass}
                />
              </div>

              <div className="medical-form-group">
                <Label className="medical-form-label">Logo da Administração</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <img src={config.logoUrl} alt="Logo" className="h-12 w-12 object-contain border rounded" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className={borderClass}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formatos suportados: JPG, PNG, SVG (máx. 2MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup e Restauração */}
          <Card className="medical-card">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-medical-primary" />
                Backup e Restauração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button onClick={exportData} className="btn-medical-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
                
                <div>
                  <Label htmlFor="import-file" className="cursor-pointer">
                    <Button variant="outline" className="w-full" asChild>
                      <div>
                        <Upload className="h-4 w-4 mr-2" />
                        Importar Dados
                      </div>
                    </Button>
                  </Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </div>

                <Button 
                  variant="destructive" 
                  onClick={clearAllData}
                  className="w-full"
                >
                  Limpar Todos os Dados
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Pacientes:</strong> {patients.length}</p>
                <p><strong>Medicamentos:</strong> {medications.length}</p>
                <p><strong>Receituários:</strong> {prescriptions.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card className="medical-card">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-medical-primary" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Versão:</span>
                  <span className="font-mono">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Navegador:</span>
                  <span className="font-mono">{navigator.userAgent.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Armazenamento:</span>
                  <span className="font-mono">LocalStorage</span>
                </div>
                <div className="flex justify-between">
                  <span>Última Atualização:</span>
                  <span className="font-mono">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Avançadas */}
          <Card className="medical-card lg:col-span-2">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-medical-primary" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="medical-form-label">Salvamento Automático</Label>
                      <p className="text-sm text-muted-foreground">Salvar dados automaticamente</p>
                    </div>
                    <Switch
                      checked={config.autoSave}
                      onCheckedChange={(checked) => handleConfigChange('autoSave', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="medical-form-label">Notificações</Label>
                      <p className="text-sm text-muted-foreground">Exibir notificações do sistema</p>
                    </div>
                    <Switch
                      checked={config.notifications}
                      onCheckedChange={(checked) => handleConfigChange('notifications', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Timeout da Sessão (minutos)</Label>
                    <Select
                      value={config.sessionTimeout.toString()}
                      onValueChange={(value) => handleConfigChange('sessionTimeout', parseInt(value))}
                    >
                      <SelectTrigger className={borderClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="0">Sem timeout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Configuracoes;
