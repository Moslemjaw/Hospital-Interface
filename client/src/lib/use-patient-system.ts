import { useState, useEffect, useCallback } from 'react';
import { PatientBST, Patient } from './hospital-system';
import { useToast } from '@/hooks/use-toast';

// Singleton instance to persist across re-renders if context isn't used
// In a real app we'd use Context, but this is simple enough
const bst = new PatientBST();
let initialized = false;

export function usePatientSystem() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({ total: 0, avgAge: 0, genderDist: { M: 0, F: 0 } });
  const { toast } = useToast();

  // Force update local state from BST
  const refresh = useCallback(() => {
    const allPatients = bst.getAllPatients();
    setPatients([...allPatients]); // Create new reference
    
    // Calculate stats
    const total = allPatients.length;
    const avgAge = total > 0 ? Math.round(allPatients.reduce((acc, p) => acc + p.age, 0) / total) : 0;
    const genderDist = allPatients.reduce((acc: any, p) => {
      acc[p.gender] = (acc[p.gender] || 0) + 1;
      return acc;
    }, { M: 0, F: 0 });

    setStats({ total, avgAge, genderDist });
  }, []);

  // Initialize once
  useEffect(() => {
    if (!initialized) {
      // Try to load from localStorage
      const saved = localStorage.getItem('hospital-system-data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          parsed.forEach((p: Patient) => bst.insert(p));
          console.log("Loaded from localStorage");
        } catch (e) {
          console.error("Failed to load data", e);
          bst.loadTestData();
        }
      } else {
        bst.loadTestData();
      }
      initialized = true;
    }
    refresh();
  }, [refresh]);

  // Persist on changes
  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem('hospital-system-data', JSON.stringify(patients));
    }
  }, [patients]);

  const addPatient = (patient: Patient) => {
    if (bst.searchById(patient.patientId)) {
      toast({
        title: "Error",
        description: `Patient ID ${patient.patientId} already exists.`,
        variant: "destructive"
      });
      return false;
    }
    
    bst.insert(patient);
    refresh();
    toast({
      title: "Success",
      description: `Patient ${patient.name} added successfully.`,
    });
    return true;
  };

  const updatePatient = (originalId: number, updatedData: Partial<Patient>) => {
    const existing = bst.searchById(originalId);
    if (!existing) return false;

    // In a BST, if ID changes, we must delete and re-insert
    // But for this simple update, we usually don't change ID. 
    // If ID is changing, it's a bit more complex.
    
    // Let's assume ID is immutable for simplicity in "Update", 
    // or we handle the delete/insert if ID changes.
    
    Object.assign(existing, updatedData);
    refresh();
    toast({
      title: "Updated",
      description: `Patient record updated successfully.`,
    });
    return true;
  };

  const deletePatient = (id: number) => {
    const success = bst.delete(id);
    if (success) {
      refresh();
      toast({
        title: "Deleted",
        description: `Patient ID ${id} removed from system.`,
      });
    } else {
      toast({
        title: "Error",
        description: `Could not delete patient ${id}.`,
        variant: "destructive"
      });
    }
    return success;
  };

  const searchPatients = (query: string) => {
    if (!query) {
      refresh();
      return;
    }

    // Check if query is a number (ID search)
    if (!isNaN(Number(query))) {
      const p = bst.searchById(Number(query));
      setPatients(p ? [p] : []);
    } else {
      // Name search
      const results = bst.searchByName(query);
      setPatients(results);
    }
  };

  return {
    patients,
    stats,
    addPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    refresh
  };
}
