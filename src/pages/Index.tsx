
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Pill, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Patient, Medication, Prescription } from "@/types";

const Index = () => {
  const navigate = useNavigate();
  const [patients] = useLocalStorage<Patient[]>('sismed-patients', []);
  const [medications] = useLocalStorage<Medication[]>('sismed-medications', []);
  const [prescriptions] = useLocalStorage<Prescription[]>('sismed-prescriptions', []);

  const stats = [
    {
      title: "Total de Pacientes",
      value: patients.length,
      icon: Users,
      color: "text-medical-primary",
      action: () => navigate("/pacientes")
    },
    {
      title: "Total de Medicamentos",
      value: medications.length,
      icon: Pill,
      color: "text-medical-success",
      action: () => navigate("/medicamentos")
    },
    {
      title: "Receitas Emitidas",
      value: prescriptions.length,
      icon: FileText,
      color: "text-medical-warning",
      action: () => navigate("/receitas")
    }
  ];

  const recentPrescriptions = prescriptions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            SISMED Perobal
          </h1>
          <p className="text-lg text-muted-foreground">
            Sistema de Saúde Municipal - Versão 3.0
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="medical-card cursor-pointer hover:scale-105 transition-transform"
              onClick={stat.action}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-12 w-12 ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="medical-card">
          <CardHeader className="medical-card-header">
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="btn-medical-success h-16"
                onClick={() => navigate("/pacientes")}
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Paciente
              </Button>
              <Button 
                className="btn-medical-primary h-16"
                onClick={() => navigate("/medicamentos")}
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Medicamento
              </Button>
              <Button 
                className="btn-medical-warning h-16"
                onClick={() => navigate("/receitas")}
              >
                <FileText className="h-5 w-5 mr-2" />
                Nova Receita
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        {recentPrescriptions.length > 0 && (
          <Card className="medical-card">
            <CardHeader className="medical-card-header">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-medical-primary" />
                Receitas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-medical-warning">
                    <div>
                      <p className="font-medium text-foreground">
                        {prescription.patientName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {prescription.medications.length} medicamento{prescription.medications.length > 1 ? 's' : ''} • {new Date(prescription.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className="text-xs bg-medical-primary text-white px-2 py-1 rounded-full">
                      {prescription.id}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Index;
