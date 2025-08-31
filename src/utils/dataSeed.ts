
import { Patient, Medication } from '@/types';

// Novos dados de pacientes para SISMED v4.0
const SEED_PATIENTS: Omit<Patient, 'id'>[] = [
  { name: 'IGOR MARTINS FERREIRA', birthDate: '2001-03-27', cns: '707103879941220', phone: '', address: '' },
  { name: 'MARIA VERONICE GARBUGIO CASAVECHIA', birthDate: '1957-10-31', cns: '701207023822217', phone: '', address: '' },
  { name: 'VANESSA CASAVECHIA CIA', birthDate: '1980-08-11', cns: '709608626663377', phone: '', address: '' },
  { name: 'EDILMA CRIVOI', birthDate: '1978-03-27', cns: '700904925268690', phone: '', address: '' },
  { name: 'JOÃO RODRIGUES D´ALARME', birthDate: '1940-01-12', cns: '898003946575562', phone: '', address: '' },
  { name: 'MARCIO RISATO CAMPIOLO', birthDate: '1985-05-27', cns: '709004887035819', phone: '', address: '' },
  { name: 'RAIMUNDO EDSON FERREIRA LIMA', birthDate: '1972-03-11', cns: '704007311548060', phone: '', address: '' },
  { name: 'WILMAR FERREIRA LIMA', birthDate: '1969-11-06', cns: '708907776199410', phone: '', address: '' },
  { name: 'ALIFER SOARES', birthDate: '2019-05-26', cns: '704705785840430', phone: '', address: '' },
  { name: 'CAROLINA MARTINS MACHADO DOS SANTOS', birthDate: '1937-05-22', cns: '702500318940333', phone: '', address: '' },
  { name: 'CLEONICE LIMA NOVAES DE LIMA', birthDate: '1966-02-22', cns: '700005366280103', phone: '', address: '' },
  { name: 'THAIS NOVAES OLIVEIRA', birthDate: '2001-07-08', cns: '704202721578982', phone: '', address: '' },
  { name: 'DANIEL RISSATI', birthDate: '1948-08-13', cns: '700503387876955', phone: '', address: '' },
  { name: 'ELISANGELA GONÇCALVES PEREIRA FERREIRA', birthDate: '1983-03-07', cns: '700506975463158', phone: '', address: '' },
  { name: 'IRENE ALVES DE JESUS MILITÃO', birthDate: '1955-08-08', cns: '709000872717419', phone: '', address: '' },
  { name: 'JALVIR ROSSI BORGUEZANI', birthDate: '1972-05-18', cns: '700002064314908', phone: '', address: '' },
  { name: 'LUCAS THIAGO DE MACEDO', birthDate: '1994-04-14', cns: '709006830862610', phone: '', address: '' },
  { name: 'MARIA DA PIEDADE SILVEIRA PEREIRA', birthDate: '1968-08-17', cns: '707808653146010', phone: '', address: '' },
  { name: 'PAULO EDUARDO CASAVECHIA CIA', birthDate: '2000-10-28', cns: '705809438837130', phone: '', address: '' },
  { name: 'ZILDA CAVALHEIRO NOVAIS', birthDate: '1984-04-06', cns: '702303172287511', phone: '', address: '' },
  { name: 'SILVANA SPANSERKI DE ARAUJO', birthDate: '1971-10-19', cns: '701808251717774', phone: '', address: '' },
  { name: 'LIDIANE SPANSERKI DE ARAUJO', birthDate: '1999-05-06', cns: '700800440319681', phone: '', address: '' },
  { name: 'MICHELI FRANCO HORVATH', birthDate: '1988-01-14', cns: '700004591545606', phone: '', address: '' },
  { name: 'ROSIANE SILVA DE LIMA BASSI', birthDate: '1973-10-10', cns: '705000646866155', phone: '', address: '' },
  { name: 'GEFERSON DE SOUZA ALVES', birthDate: '2002-11-16', cns: '700909986860195', phone: '', address: '' },
  { name: 'GABRIEL EMANUEL ARAUJO DA SILVA', birthDate: '1994-10-28', cns: '700201971121021', phone: '', address: '' },
  { name: 'ANDERSON LIMA RODRIGUES DE ARAUJO', birthDate: '1999-06-23', cns: '702400557809824', phone: '', address: '' },
  { name: 'RODRIGO ROSA DA SILVA', birthDate: '1995-10-15', cns: '700601450655962', phone: '', address: '' },
  { name: 'RENATO ROSA DA SILVA', birthDate: '1997-10-05', cns: '705004002815159', phone: '', address: '' },
  { name: 'VALDETE NUNES PEREIRA', birthDate: '1977-08-22', cns: '708104147817040', phone: '', address: '' },
  { name: 'BRUNO PEREIRA DE MELLO', birthDate: '1999-03-07', cns: '702807632240865', phone: '', address: '' },
  { name: 'TEREZINHA DE FATIMA C. MATOSINHO', birthDate: '1958-04-28', cns: '700102417174220', phone: '', address: '' },
  { name: 'JOSEFA AMELIA PEREIRA LEAL', birthDate: '1962-07-03', cns: '705004414988557', phone: '', address: '' },
  { name: 'OSVALDO HORVATH', birthDate: '1949-08-15', cns: '700402942254050', phone: '', address: '' },
  { name: 'ANTONIA ROQUE RICARDO', birthDate: '1968-04-11', cns: '704800078864046', phone: '', address: '' }
];

// Novos medicamentos para SISMED v4.0
const SEED_MEDICATIONS: Omit<Medication, 'id'>[] = [
  { name: 'AMITRIPTILINA', dosage: '25MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'ÁCIDO VALPROICO', dosage: '250MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'ÁCIDO VALPROICO', dosage: '500MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'ÁCIDO VALPROICO', dosage: '50MG/ML', presentation: 'SUSPENSÃO ORAL', isControlled: false },
  { name: 'BIPERIDENO CLORIDRATO', dosage: '2MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'CARBAMAZEPINA', dosage: '200MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'CARBAMAZEPINA', dosage: '20MG/ML', presentation: 'SUSPENSÃO', isControlled: false },
  { name: 'CARBONATO DE LÍTIO', dosage: '300MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'CLOMIPRAMINA CLORIDRATO', dosage: '25MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'CLONAZEPAM', dosage: '2MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'CLONAZEPAM', dosage: '2.5MG/ML', presentation: 'SOLUÇÃO ORAL', isControlled: true },
  { name: 'CLORPROMAZINA CLORIDRATO', dosage: '25MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'CLORPROMAZINA CLORIDRATO', dosage: '100MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'DESVENLAFAXINA SUCCINATO', dosage: '50MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'DIAZEPAM', dosage: '5MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'DIAZEPAM', dosage: '10MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'ESCITALOPRAM', dosage: '10MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'FENITOÍNA SÓDICA', dosage: '100MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'FENOBARBITAL', dosage: '100MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'FENOBARBITAL', dosage: '40MG/ML', presentation: 'SOLUÇÃO ORAL', isControlled: true },
  { name: 'FLUOXETINA', dosage: '20MG', presentation: 'CÁPSULA/COMPRIMIDO', isControlled: false },
  { name: 'HALOPERIDOL', dosage: '1MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'HALOPERIDOL', dosage: '5MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'HALOPERIDOL', dosage: '2MG/ML', presentation: 'SOLUÇÃO ORAL', isControlled: true },
  { name: 'HALOPERIDOL DECANOATO', dosage: '50MG/ML', presentation: 'SOLUÇÃO INJETÁVEL', isControlled: true },
  { name: 'IMIPRAMINA CLORIDRATO', dosage: '25MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'LEVOMEPROMAZINA', dosage: '25MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'LEVOMEPROMAZINA', dosage: '100MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'MIRTAZAPINA', dosage: '30MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'NORTRIPTILINA CLORIDRATO', dosage: '25MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'OXCARBAZEPINA', dosage: '600MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'OXCARBAZEPINA', dosage: '60MG/ML', presentation: 'SOLUÇÃO ORAL', isControlled: false },
  { name: 'PAROXETINA CLORIDRATO', dosage: '20MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'PREGABALINA', dosage: '75MG', presentation: 'COMPRIMIDO', isControlled: true },
  { name: 'SERTRALINA CLORIDRATO', dosage: '50MG', presentation: 'COMPRIMIDO', isControlled: false },
  { name: 'VENLAFAXINA CLORIDRATO', dosage: '75MG', presentation: 'COMPRIMIDO', isControlled: false }
];

export const initializeData = () => {
  // Força a reinicialização dos dados para SISMED v4.0
  console.log('🔄 Inicializando SISMED Perobal v4.0...');
  
  // Remove dados antigos
  localStorage.removeItem('sismed-patients');
  localStorage.removeItem('sismed-medications');

  const patients = SEED_PATIENTS.map((patient, index) => ({
    ...patient,
    id: `patient_${index + 1}`
  }));
  
  const medications = SEED_MEDICATIONS.map((medication, index) => ({
    ...medication,
    id: `medication_${index + 1}`
  }));

  localStorage.setItem('sismed-patients', JSON.stringify(patients));
  localStorage.setItem('sismed-medications', JSON.stringify(medications));
  
  console.log('✅ Base de dados SISMED v4.0 inicializada');
  console.log('✅ Pacientes carregados:', patients.length);
  console.log('✅ Medicamentos carregados:', medications.length);
};
