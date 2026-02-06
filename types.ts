
export enum UserRole {
  ADMIN = 'ADMIN',
  GERENTE_INSTALACAO = 'GERENTE_INSTALACAO',
  ENG_PROCESSO = 'ENG_PROCESSO',
  TECNICO_MANUTENCAO = 'TECNICO_MANUTENCAO',
  COORD_HSE = 'COORD_HSE',
  COMITE_APROVACAO = 'COMITE_APROVACAO'
}

export enum MOCStatus {
  RASCUNHO = 'Rascunho',
  SUBMETIDO = 'Submetido',
  EM_AVALIACAO = 'Em Avaliação',
  EM_REVISAO = 'Em Revisão',
  APROVADO = 'Aprovado',
  REJEITADO = 'Rejeitado',
  IMPLEMENTADO = 'Implementado',
  CONCLUIDO = 'Concluído'
}

export enum RiskLevel {
  BAIXO = 'Baixo',
  MEDIO = 'Médio',
  ALTO = 'Alto',
  CRITICO = 'Crítico'
}

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'READ' | 'WRITE' | 'LOGIN' | 'LOGOUT' | 'DELETE' | 'STATUS_CHANGE' | 'WORK_ORDER' | 'SECURITY_VIOLATION';
  resource: string;
  timestamp: string;
  details?: string;
  changes?: AuditChange[];
  ip?: string; // Simulado
}

export interface MOCHistoryEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  type: 'status_change' | 'comment' | 'system' | 'work_order';
  details?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  type: string;
  status: 'Ativo' | 'Inativo' | 'Manutenção';
}

export interface Asset {
  id: string;
  facilityId: string;
  tag: string;
  name: string;
  type: string;
  status: string;
  lastMaintenance: string;
}

export interface MOCRequest {
  id: string;
  title: string;
  description: string;
  scope: string;
  justification: string;
  status: MOCStatus;
  requesterId: string;
  facilityId: string;
  createdAt: string;
  updatedAt: string;
  history: MOCHistoryEntry[];
  type?: string; // Routine, Major, Emergency
}

export interface RiskAssessment {
  id: string;
  mocId: string;
  probability: number; // 1-5
  severity: number;    // 1-5
  mitigationMeasures: string;
  residualRisk: RiskLevel;
}

export interface WorkOrder {
  id: string;
  mocId: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluída' | 'Atrasada';
  createdAt?: string;
  notificationEmail?: string;
}

export interface StandardLink {
  id: string;
  title: string;
  url: string;
  category: string;
}
