
export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  cns: string;
  phone: string;
  address: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  presentation: string;
  isControlled: boolean;
}

export interface PrescriptionMedication {
  medication: Medication;
  posology: string;
  quantity: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientCNS: string;
  medications: PrescriptionMedication[];
  months: number;
  observations: string;
  date: string;
  professionalName: string;
}

export interface Professional {
  name: string;
  type: string;
  registry: string;
  specialty: string;
  healthUnit: string;
  rememberData: boolean;
}

export interface MedicalCertificate {
  id: string;
  patientId: string;
  patientName: string;
  patientCNS: string;
  daysOff: number;
  startDate: string;
  endDate: string;
  reason: string;
  cid: string;
  observations: string;
  date: string;
  professionalName: string;
}

export interface AttendanceCertificate {
  id: string;
  patientId: string;
  patientName: string;
  patientCNS: string;
  attendanceDate: string;
  attendanceTime: string;
  duration: string;
  purpose: string;
  observations: string;
  date: string;
  professionalName: string;
}
