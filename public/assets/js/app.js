
// SISMED Perobal v4.0 - Arquitetura de Camadas
const App = (() => {
    // 1. Estado Global da Aplicação
    const state = {
        currentView: 'dashboard',
        currentUser: null,
        isLoading: false,
        database: null
    };

    // 2. Módulo de Banco de Dados (Camada de Abstração)
    const Database = (() => {
        let db = null;

        // Seed de Pacientes
        const PATIENTS_SEED = [
            { nome: "IGOR MARTINS FERREIRA", data_nascimento: "2001-03-27", cns: "707103879941220" },
            { nome: "MARIA VERONICE GARBUGIO CASAVECHIA", data_nascimento: "1957-10-31", cns: "701207023822217" },
            { nome: "VANESSA CASAVECHIA CIA", data_nascimento: "1980-08-11", cns: "709608626663377" },
            { nome: "EDILMA CRIVOI", data_nascimento: "1978-03-27", cns: "700904925268690" },
            { nome: "JOÃO RODRIGUES D´ALARME", data_nascimento: "1940-01-12", cns: "898003946575562" },
            { nome: "MARCIO RISATO CAMPIOLO", data_nascimento: "1985-05-27", cns: "709004887035819" },
            { nome: "RAIMUNDO EDSON FERREIRA LIMA", data_nascimento: "1972-03-11", cns: "704007311548060" },
            { nome: "WILMAR FERREIRA LIMA", data_nascimento: "1969-11-06", cns: "708907776199410" },
            { nome: "ALIFER SOARES", data_nascimento: "2019-05-26", cns: "704705785840430" },
            { nome: "CAROLINA MARTINS MACHADO DOS SANTOS", data_nascimento: "1937-05-22", cns: "702500318940333" },
            { nome: "CLEONICE LIMA NOVAES DE LIMA", data_nascimento: "1966-02-22", cns: "700005366280103" },
            { nome: "THAIS NOVAES OLIVEIRA", data_nascimento: "2001-07-08", cns: "704202721578982" },
            { nome: "DANIEL RISSATI", data_nascimento: "1948-08-13", cns: "700503387876955" },
            { nome: "ELISANGELA GONÇCALVES PEREIRA FERREIRA", data_nascimento: "1983-03-07", cns: "700506975463158" },
            { nome: "IRENE ALVES DE JESUS MILITÃO", data_nascimento: "1955-08-08", cns: "709000872717419" },
            { nome: "JALVIR ROSSI BORGUEZANI", data_nascimento: "1972-05-18", cns: "700002064314908" },
            { nome: "LUCAS THIAGO DE MACEDO", data_nascimento: "1994-04-14", cns: "709006830862610" },
            { nome: "MARIA DA PIEDADE SILVEIRA PEREIRA", data_nascimento: "1968-08-17", cns: "707808653146010" },
            { nome: "PAULO EDUARDO CASAVECHIA CIA", data_nascimento: "2000-10-28", cns: "705809438837130" },
            { nome: "ZILDA CAVALHEIRO NOVAIS", data_nascimento: "1984-04-06", cns: "702303172287511" },
            { nome: "SILVANA SPANSERKI DE ARAUJO", data_nascimento: "1971-10-19", cns: "701808251717774" },
            { nome: "LIDIANE SPANSERKI DE ARAUJO", data_nascimento: "1999-05-06", cns: "700800440319681" },
            { nome: "MICHELI FRANCO HORVATH", data_nascimento: "1988-01-14", cns: "700004591545606" },
            { nome: "ROSIANE SILVA DE LIMA BASSI", data_nascimento: "1973-10-10", cns: "705000646866155" },
            { nome: "GEFERSON DE SOUZA ALVES", data_nascimento: "2002-11-16", cns: "700909986860195" },
            { nome: "GABRIEL EMANUEL ARAUJO DA SILVA", data_nascimento: "1994-10-28", cns: "700201971121021" },
            { nome: "ANDERSON LIMA RODRIGUES DE ARAUJO", data_nascimento: "1999-06-23", cns: "702400557809824" },
            { nome: "RODRIGO ROSA DA SILVA", data_nascimento: "1995-10-15", cns: "700601450655962" },
            { nome: "RENATO ROSA DA SILVA", data_nascimento: "1997-10-05", cns: "705004002815159" },
            { nome: "VALDETE NUNES PEREIRA", data_nascimento: "1977-08-22", cns: "708104147817040" },
            { nome: "BRUNO PEREIRA DE MELLO", data_nascimento: "1999-03-07", cns: "702807632240865" },
            { nome: "TEREZINHA DE FATIMA C. MATOSINHO", data_nascimento: "1958-04-28", cns: "700102417174220" },
            { nome: "JOSEFA AMELIA PEREIRA LEAL", data_nascimento: "1962-07-03", cns: "705004414988557" },
            { nome: "OSVALDO HORVATH", data_nascimento: "1949-08-15", cns: "700402942254050" },
            { nome: "ANTONIA ROQUE RICARDO", data_nascimento: "1968-04-11", cns: "704800078864046" }
        ];

        // Seed de Medicamentos
        const MEDICINES_SEED = [
            { id: 1, nome: "AMITRIPTILINA", dosagem: "25MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 2, nome: "ÁCIDO VALPROICO", dosagem: "250MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 3, nome: "ÁCIDO VALPROICO", dosagem: "500MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 4, nome: "ÁCIDO VALPROICO", dosagem: "50MG/ML", apresentacao: "SUSPENSÃO ORAL", controlado: false },
            { id: 5, nome: "BIPERIDENO CLORIDRATO", dosagem: "2MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 6, nome: "CARBAMAZEPINA", dosagem: "200MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 7, nome: "CARBAMAZEPINA", dosagem: "20MG/ML", apresentacao: "SUSPENSÃO", controlado: false },
            { id: 8, nome: "CARBONATO DE LÍTIO", dosagem: "300MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 9, nome: "CLOMIPRAMINA CLORIDRATO", dosagem: "25MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 10, nome: "CLONAZEPAM", dosagem: "2MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 11, nome: "CLONAZEPAM", dosagem: "2.5MG/ML", apresentacao: "SOLUÇÃO ORAL", controlado: true },
            { id: 12, nome: "CLORPROMAZINA CLORIDRATO", dosagem: "25MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 13, nome: "CLORPROMAZINA CLORIDRATO", dosagem: "100MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 14, nome: "DESVENLAFAXINA SUCCINATO", dosagem: "50MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 15, nome: "DIAZEPAM", dosagem: "5MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 16, nome: "DIAZEPAM", dosagem: "10MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 17, nome: "ESCITALOPRAM", dosagem: "10MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 18, nome: "FENITOÍNA SÓDICA", dosagem: "100MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 19, nome: "FENOBARBITAL", dosagem: "100MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 20, nome: "FENOBARBITAL", dosagem: "40MG/ML", apresentacao: "SOLUÇÃO ORAL", controlado: true },
            { id: 21, nome: "FLUOXETINA", dosagem: "20MG", apresentacao: "CÁPSULA/COMPRIMIDO", controlado: false },
            { id: 22, nome: "HALOPERIDOL", dosagem: "1MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 23, nome: "HALOPERIDOL", dosagem: "5MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 24, nome: "HALOPERIDOL", dosagem: "2MG/ML", apresentacao: "SOLUÇÃO ORAL", controlado: true },
            { id: 25, nome: "HALOPERIDOL DECANOATO", dosagem: "50MG/ML", apresentacao: "SOLUÇÃO INJETÁVEL", controlado: true },
            { id: 26, nome: "IMIPRAMINA CLORIDRATO", dosagem: "25MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 27, nome: "LEVOMEPROMAZINA", dosagem: "25MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 28, nome: "LEVOMEPROMAZINA", dosagem: "100MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 29, nome: "MIRTAZAPINA", dosagem: "30MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 30, nome: "NORTRIPTILINA CLORIDRATO", dosagem: "25MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 31, nome: "OXCARBAZEPINA", dosagem: "600MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 32, nome: "OXCARBAZEPINA", dosagem: "60MG/ML", apresentacao: "SOLUÇÃO ORAL", controlado: false },
            { id: 33, nome: "PAROXETINA CLORIDRATO", dosagem: "20MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 34, nome: "PREGABALINA", dosagem: "75MG", apresentacao: "COMPRIMIDO", controlado: true },
            { id: 35, nome: "SERTRALINA CLORIDRATO", dosagem: "50MG", apresentacao: "COMPRIMIDO", controlado: false },
            { id: 36, nome: "VENLAFAXINA CLORIDRATO", dosagem: "75MG", apresentacao: "COMPRIMIDO", controlado: false }
        ];

        const init = async () => {
            // Simula inicialização do banco de dados
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Limpa dados antigos e carrega novos dados
            localStorage.removeItem('sismed-patients');
            localStorage.removeItem('sismed-medications');
            
            // Converte dados de pacientes para o formato correto
            const patients = PATIENTS_SEED.map((patient, index) => ({
                id: `patient_${index + 1}`,
                name: patient.nome,
                birthDate: patient.data_nascimento,
                cns: patient.cns,
                phone: '',
                address: ''
            }));

            // Converte dados de medicamentos para o formato correto
            const medications = MEDICINES_SEED.map(med => ({
                id: `medication_${med.id}`,
                name: med.nome,
                dosage: med.dosagem,
                presentation: med.apresentacao,
                isControlled: med.controlado
            }));

            localStorage.setItem('sismed-patients', JSON.stringify(patients));
            localStorage.setItem('sismed-medications', JSON.stringify(medications));
            
            console.log('✅ Base de dados SISMED v4.0 inicializada com sucesso');
            console.log('✅ Pacientes carregados:', patients.length);
            console.log('✅ Medicamentos carregados:', medications.length);
            
            return true;
        };

        const query = (sql, params = []) => {
            // Implementação futura para queries SQL
            console.log('Query:', sql, params);
        };

        const run = (sql, params = []) => {
            // Implementação futura para operações SQL
            console.log('Run:', sql, params);
        };

        return { init, query, run };
    })();

    // 3. Módulo de Renderização e UI
    const UI = (() => {
        const showLoading = () => {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }
        };

        const hideLoading = () => {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        };

        return { showLoading, hideLoading };
    })();

    // 4. Funções de Ação e Lógica de Negócios
    const Actions = (() => {
        const loadDashboardData = async () => {
            // Carrega dados do dashboard
            console.log('Dashboard data loaded');
        };

        const navigateTo = (view) => {
            state.currentView = view;
            console.log('Navigated to:', view);
        };

        return { loadDashboardData, navigateTo };
    })();

    // 5. Inicialização da Aplicação
    const initApp = async () => {
        try {
            UI.showLoading();
            
            await Database.init();
            await Actions.loadDashboardData();
            Actions.navigateTo('dashboard');
            
        } catch (error) {
            console.error("Erro na inicialização:", error);
        } finally {
            UI.hideLoading();
        }
    };

    // Interface Pública
    return {
        init: () => {
            initApp();
        }
    };
})();

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', App.init);
