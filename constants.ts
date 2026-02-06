
import { UserRole, MOCStatus, Facility, WorkOrder, Asset, MOCRequest } from './types';

// Unidades Operacionais Iniciais
export const INITIAL_FACILITIES: Facility[] = [
  { id: '1', name: 'P-50 Albacora Leste', location: 'Bacia de Campos', type: 'FPSO', status: 'Ativo' },
  { id: '2', name: 'P-57 Jubarte', location: 'Bacia do Espírito Santo', type: 'FPSO', status: 'Ativo' },
  { id: '3', name: 'Plataforma Mexilhão', location: 'Bacia de Santos', type: 'Fixa', status: 'Manutenção' },
];

// Usuários Iniciais
export const INITIAL_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@moctudio.com', role: UserRole.ADMIN, active: true },
  { id: '2', name: 'Carlos Processos', email: 'carlos@oilgas.com', role: UserRole.ENG_PROCESSO, active: true },
  { id: '3', name: 'Ana HSE', email: 'ana@oilgas.com', role: UserRole.COORD_HSE, active: true },
];

// Ativos/Equipamentos Iniciais de Exemplo
export const INITIAL_ASSETS: Asset[] = [
  { 
    id: 'ASSET-001', 
    facilityId: '1', 
    tag: 'VAL-200-01', 
    name: 'Válvula de Esfera (SDV)', 
    type: 'Válvula de Segurança', 
    status: 'Operacional', 
    lastMaintenance: '10/01/2024' 
  },
  { 
    id: 'ASSET-002', 
    facilityId: '1', 
    tag: 'PMP-105-A', 
    name: 'Bomba Centrífuga Multiestágio', 
    type: 'Bomba de Exportação', 
    status: 'Operacional', 
    lastMaintenance: '15/12/2023' 
  },
  { 
    id: 'ASSET-003', 
    facilityId: '2', 
    tag: 'CMP-400-B', 
    name: 'Compressor de Gás Natural', 
    type: 'Compressor', 
    status: 'Manutenção', 
    lastMaintenance: '20/02/2024' 
  },
  { 
    id: 'ASSET-004', 
    facilityId: '3', 
    tag: 'PIT-500-01', 
    name: 'Transmissor de Pressão Diferencial', 
    type: 'Instrumentação', 
    status: 'Operacional', 
    lastMaintenance: '05/02/2024' 
  }
];

// Solicitações de Mudança (MOCs) Iniciais de Exemplo
export const INITIAL_MOCS: MOCRequest[] = [
  {
    id: 'MOC-24-001',
    title: 'Upgrade do Sistema de Controle de Pressão - Linha 200',
    type: 'MAJOR',
    facilityId: '1',
    status: MOCStatus.EM_AVALIACAO,
    requesterId: '2',
    description: 'Modernização dos transdutores e lógica de intertravamento para maior redundância.',
    scope: 'Substituição de 3 transmissores PT-201/202/203 por modelos HART 7. Atualização da lógica no PLC DeltaV.',
    justification: 'Redução de disparos espúrios e atendimento à nova norma de segurança funcional.',
    createdAt: '12/02/2024, 09:15:00',
    updatedAt: '12/02/2024, 14:30:00',
    history: [
      {
        id: 'h1',
        userId: '1',
        userName: 'Admin User',
        action: 'Alteração de Status para: Em Avaliação',
        timestamp: '12/02/2024, 14:30:00',
        type: 'status_change',
        details: 'Dossier completo recebido. Iniciando análise técnica multidisciplinar.'
      },
      {
        id: 'h2',
        userId: '2',
        userName: 'Carlos Processos',
        action: 'Abertura de Solicitação',
        timestamp: '12/02/2024, 09:15:00',
        type: 'system',
        details: 'MOC criada via template MAJOR.'
      }
    ]
  },
  {
    id: 'MOC-24-002',
    title: 'Troca Preventiva de Atuador da SDV-501',
    type: 'ROUTINE',
    facilityId: '2',
    status: MOCStatus.APROVADO,
    requesterId: '1',
    description: 'Substituição do atuador pneumático por falha intermitente na mola de retorno.',
    scope: 'Remover atuador atual, instalar novo kit de vedação e mola. Testar tempo de fechamento (Stroke Test).',
    justification: 'Prevenção de falha no fechamento de emergência da linha de exportação.',
    createdAt: '05/02/2024, 08:00:00',
    updatedAt: '06/02/2024, 10:00:00',
    history: [
      {
        id: 'h3',
        userId: '3',
        userName: 'Ana HSE',
        action: 'Alteração de Status para: Aprovado',
        timestamp: '06/02/2024, 10:00:00',
        type: 'status_change',
        details: 'Aprovado conforme análise de risco preliminar. Proceder com cautela durante o isolamento.'
      }
    ]
  },
  {
    id: 'MOC-24-003',
    title: 'Reparo de Vazamento em Linha de Ar Comprimido',
    type: 'EMERGENCY',
    facilityId: '3',
    status: MOCStatus.CONCLUIDO,
    requesterId: '2',
    description: 'Furo detectado por corrosão sob isolamento em trecho de 2 polegadas.',
    scope: 'Corte do trecho corroído e soldagem de nova luva. Ensaio de líquido penetrante na solda.',
    justification: 'Risco de perda de pressão nos instrumentos de controle da plataforma.',
    createdAt: '01/02/2024, 11:45:00',
    updatedAt: '03/02/2024, 17:00:00',
    history: [
      {
        id: 'h4',
        userId: '1',
        userName: 'Admin User',
        action: 'Alteração de Status para: Concluído',
        timestamp: '03/02/2024, 17:00:00',
        type: 'status_change',
        details: 'Reparo executado e testado com sucesso. Dossier arquivado.'
      }
    ]
  },
  {
    id: 'MOC-24-004',
    title: 'Alteração de Layout em Oficina de Manutenção',
    type: 'MAJOR',
    facilityId: '1',
    status: MOCStatus.REJEITADO,
    requesterId: '2',
    description: 'Instalação de novas bancadas e remoção de antepara corta-fogo.',
    scope: 'Remover antepara da seção B para expandir área de soldagem.',
    justification: 'Necessidade de maior espaço para montagem de spools.',
    createdAt: '20/01/2024, 14:00:00',
    updatedAt: '22/01/2024, 16:30:00',
    history: [
      {
        id: 'h5',
        userId: '3',
        userName: 'Ana HSE',
        action: 'Alteração de Status para: Rejeitado',
        timestamp: '22/01/2024, 16:30:00',
        type: 'status_change',
        details: 'A remoção da antepara corta-fogo compromete a compartimentação de incêndio do deck principal. Proposta indeferida por riscos de segurança.'
      }
    ]
  }
];

// Ordens de Serviço Iniciais
export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  { 
    id: 'WO-001', 
    mocId: '', 
    title: 'Calibração de Sensores de Pressão - Linha A', 
    assignedTo: 'João Técnico', 
    dueDate: '2024-05-20', 
    status: 'Pendente', 
    createdAt: '10/05/2024' 
  },
  { 
    id: 'WO-002', 
    mocId: '', 
    title: 'Inspeção Visual de Flanges e Conexões', 
    assignedTo: 'Maria Engenheira', 
    dueDate: '2024-05-22', 
    status: 'Pendente', 
    createdAt: '11/05/2024' 
  },
  { 
    id: 'WO-2024-01', 
    mocId: 'MOC-24-001', 
    title: 'Substituição de Atuador de Válvula Esfera', 
    assignedTo: 'Marcos Silva', 
    dueDate: '2024-02-15', 
    status: 'Em Andamento', 
    createdAt: '01/02/2024' 
  }
];

export const MOC_STATUS_COLORS: Record<MOCStatus, string> = {
  [MOCStatus.RASCUNHO]: 'bg-gray-200 text-gray-700',
  [MOCStatus.SUBMETIDO]: 'bg-blue-100 text-blue-700',
  [MOCStatus.EM_AVALIACAO]: 'bg-amber-100 text-amber-700',
  [MOCStatus.EM_REVISAO]: 'bg-purple-100 text-purple-700',
  [MOCStatus.APROVADO]: 'bg-emerald-100 text-emerald-700',
  [MOCStatus.REJEITADO]: 'bg-red-100 text-red-700',
  [MOCStatus.IMPLEMENTADO]: 'bg-indigo-100 text-indigo-700',
  [MOCStatus.CONCLUIDO]: 'bg-teal-100 text-teal-700',
};

export const RISK_LEVEL_COLORS = {
  Baixo: 'bg-emerald-500',
  Médio: 'bg-yellow-400',
  Alto: 'bg-orange-500',
  Crítico: 'bg-red-600',
};
