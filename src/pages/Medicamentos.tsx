
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Pill, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Medication } from '@/types';

const Medicamentos = () => {
  const [medications, setMedications] = useLocalStorage<Medication[]>('sismed-medications', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  
  const [formData, setFormData] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    presentation: '',
    isControlled: false
  });

  const filteredMedications = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      presentation: '',
      isControlled: false
    });
    setEditingMedication(null);
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      presentation: medication.presentation,
      isControlled: medication.isControlled
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este medicamento?')) {
      setMedications(medications.filter(m => m.id !== id));
      toast.success('Medicamento excluído com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicates (case-insensitive combination of name + dosage + presentation)
    const isDuplicate = medications.some(med => 
      med.id !== editingMedication?.id &&
      med.name.toLowerCase() === formData.name.toLowerCase() &&
      med.dosage.toLowerCase() === formData.dosage.toLowerCase() &&
      med.presentation.toLowerCase() === formData.presentation.toLowerCase()
    );

    if (isDuplicate) {
      toast.error('Já existe um medicamento com essa combinação de nome, dosagem e apresentação.');
      return;
    }

    if (editingMedication) {
      setMedications(medications.map(m => 
        m.id === editingMedication.id 
          ? { ...formData, id: editingMedication.id }
          : m
      ));
      toast.success('Medicamento atualizado com sucesso!');
    } else {
      const newMedication: Medication = {
        ...formData,
        id: Date.now().toString()
      };
      setMedications([...medications, newMedication]);
      toast.success('Medicamento cadastrado com sucesso!');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Gestão de Medicamentos
            </h1>
            <p className="text-muted-foreground mt-1">
              Cadastre e gerencie os medicamentos disponíveis
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="btn-medical-success"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Medicamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingMedication ? 'Editar Medicamento' : 'Novo Medicamento'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="medical-form-group">
                  <Label className="medical-form-label">Nome do Medicamento *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Paracetamol"
                    className="border-2 border-medical-warning"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Dosagem *</Label>
                    <Input
                      value={formData.dosage}
                      onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                      placeholder="Ex: 500mg"
                      className="border-2 border-medical-warning"
                      required
                    />
                  </div>
                  
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Apresentação *</Label>
                    <Input
                      value={formData.presentation}
                      onChange={(e) => setFormData({...formData, presentation: e.target.value})}
                      placeholder="Ex: Comprimido"
                      className="border-2 border-medical-warning"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="controlled"
                    checked={formData.isControlled}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, isControlled: checked as boolean})
                    }
                  />
                  <Label htmlFor="controlled" className="text-sm cursor-pointer flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-medical-danger" />
                    Medicamento Controlado
                  </Label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="btn-medical-primary">
                    {editingMedication ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar medicamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-medical-warning"
              />
            </div>
          </CardContent>
        </Card>

        {/* Medications Table */}
        <Card className="medical-card">
          <CardHeader className="medical-card-header">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-medical-primary" />
              Medicamentos Cadastrados ({filteredMedications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="medical-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Dosagem</th>
                    <th>Apresentação</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedications.map((medication) => (
                    <tr key={medication.id}>
                      <td className="font-medium text-foreground">{medication.name}</td>
                      <td>{medication.dosage}</td>
                      <td>{medication.presentation}</td>
                      <td>
                        {medication.isControlled ? (
                          <span className="controlled-badge">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            CONTROLADO
                          </span>
                        ) : (
                          <span className="text-gray-600">Comum</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(medication)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(medication.id)}
                            className="text-medical-danger hover:text-medical-danger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Medicamentos;
