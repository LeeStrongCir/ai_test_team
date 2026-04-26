import { useState, useCallback, useEffect, useMemo } from "react";
import {
  getAllDiagrams,
  createDiagram as storeCreate,
  updateDiagram as storeUpdate,
  deleteDiagram as storeDelete,
  getDiagramById as storeGetById,
  type PrototypeDiagram,
  type CreateDiagramData,
  type UpdateDiagramData,
} from "../lib/store";

export function useDiagrams() {
  const [diagrams, setDiagrams] = useState<PrototypeDiagram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setDiagrams(getAllDiagrams());
    setIsLoading(false);
  }, []);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return diagrams;
    return diagrams.filter((d) => d.name.toLowerCase().includes(query));
  }, [diagrams, searchQuery]);

  const createDiagram = useCallback((data: CreateDiagramData): PrototypeDiagram => {
    const created = storeCreate(data);
    setDiagrams((prev: PrototypeDiagram[]) => [...prev, created]);
    return created;
  }, []);

  const updateDiagram = useCallback(
    (id: string, data: UpdateDiagramData): PrototypeDiagram | null => {
      const updated = storeUpdate(id, data);
      if (updated !== null) {
        setDiagrams((prev: PrototypeDiagram[]) =>
          prev.map((d: PrototypeDiagram) => (d.id === id ? updated : d)),
        );
      }
      return updated;
    },
    [],
  );

  const deleteDiagram = useCallback((id: string): boolean => {
    const success = storeDelete(id);
    if (success) {
      setDiagrams((prev: PrototypeDiagram[]) => prev.filter((d: PrototypeDiagram) => d.id !== id));
    }
    return success;
  }, []);

  const getDiagramById = useCallback(
    (id: string): PrototypeDiagram | undefined => {
      const cached = diagrams.find((d: PrototypeDiagram) => d.id === id);
      if (cached !== undefined) return cached;
      return storeGetById(id);
    },
    [diagrams],
  );

  return {
    diagrams: filtered,
    allDiagrams: diagrams,
    createDiagram,
    updateDiagram,
    deleteDiagram,
    getDiagramById: getDiagramById,
    isLoading,
    searchQuery,
    setSearchQuery,
  };
}
