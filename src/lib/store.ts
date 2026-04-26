export interface Step {
  id: string;
  text: string;
  image: string | null; // base64 data URL
}

export interface PrototypeDiagram {
  id: string;
  name: string;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiagramData {
  name: string;
  steps: Omit<Step, "id">[];
}

export interface UpdateDiagramData {
  name: string;
  steps: Omit<Step, "id">[];
}

const STORAGE_KEY = "prototype_diagrams";

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function safeGetStorage(key: string): string | null {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    localStorage.setItem(key, value);
  } catch {
    // Storage full or unavailable – fail silently
  }
}

function parseRaw(raw: string | null): PrototypeDiagram[] {
  if (raw === null) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as PrototypeDiagram[];
    return [];
  } catch {
    return [];
  }
}

export function getAllDiagrams(): PrototypeDiagram[] {
  return parseRaw(safeGetStorage(STORAGE_KEY));
}

/** Retrieve a single diagram by id, or undefined if not found. */
export function getDiagramById(id: string): PrototypeDiagram | undefined {
  const diagrams = getAllDiagrams();
  return diagrams.find((d) => d.id === id);
}

/** Create a new diagram and persist it. Returns the created diagram. */
export function createDiagram(data: CreateDiagramData): PrototypeDiagram {
  const diagrams = getAllDiagrams();
  const now = new Date().toISOString();

  const newDiagram: PrototypeDiagram = {
    id: generateId(),
    name: data.name,
    steps: data.steps.map((s) => ({ ...s, id: generateId() })),
    createdAt: now,
    updatedAt: now,
  };

  diagrams.push(newDiagram);
  safeSetStorage(STORAGE_KEY, JSON.stringify(diagrams));
  return newDiagram;
}

/**
 * Update an existing diagram. Returns the updated diagram, or null if not found.
 */
export function updateDiagram(
  id: string,
  data: UpdateDiagramData,
): PrototypeDiagram | null {
  const diagrams = getAllDiagrams();
  const index = diagrams.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const existing = diagrams[index];

  diagrams[index] = {
    ...existing,
    name: data.name,
    steps: data.steps.map((s) => ({ ...s, id: generateId() })),
    updatedAt: new Date().toISOString(),
  };

  safeSetStorage(STORAGE_KEY, JSON.stringify(diagrams));
  return diagrams[index];
}

/** Delete a diagram by id. Returns true if deleted, false if not found. */
export function deleteDiagram(id: string): boolean {
  const diagrams = getAllDiagrams();
  const index = diagrams.findIndex((d) => d.id === id);
  if (index === -1) return false;

  diagrams.splice(index, 1);
  safeSetStorage(STORAGE_KEY, JSON.stringify(diagrams));
  return true;
}
