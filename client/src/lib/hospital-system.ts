
// Types matching the Java implementation
export interface Patient {
  patientId: number;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string;
}

class Node {
  patient: Patient;
  left: Node | null;
  right: Node | null;

  constructor(patient: Patient) {
    this.patient = patient;
    this.left = null;
    this.right = null;
  }
}

// Re-implementation of PatientBST.java logic in TypeScript
export class PatientBST {
  root: Node | null;
  private messageLog: string[];

  constructor() {
    this.root = null;
    this.messageLog = [];
  }

  // Helper to log messages (replaces System.out.println)
  private log(message: string) {
    console.log(message);
    this.messageLog.push(message);
  }

  public getLogs(): string[] {
    const logs = [...this.messageLog];
    this.messageLog = []; // Clear after reading
    return logs;
  }

  public insert(patient: Patient): boolean {
    let success = false;
    this.root = this.insertHelper(this.root, patient, () => { success = true; });
    return success;
  }

  private insertHelper(node: Node | null, patient: Patient, onSuccess: () => void): Node {
    if (node === null) {
      this.log(`Success: Patient ${patient.name} added.`);
      onSuccess();
      return new Node(patient);
    }

    if (patient.patientId < node.patient.patientId) {
      node.left = this.insertHelper(node.left, patient, onSuccess);
    } else if (patient.patientId > node.patient.patientId) {
      node.right = this.insertHelper(node.right, patient, onSuccess);
    } else {
      this.log(`Error: Patient ID ${patient.patientId} already exists.`);
    }
    return node;
  }

  public searchById(id: number): Patient | null {
    return this.searchByIdHelper(this.root, id);
  }

  private searchByIdHelper(node: Node | null, id: number): Patient | null {
    if (node === null) return null;
    if (id === node.patient.patientId) return node.patient;

    return id < node.patient.patientId
      ? this.searchByIdHelper(node.left, id)
      : this.searchByIdHelper(node.right, id);
  }

  public searchByName(name: string): Patient[] {
    const results: Patient[] = [];
    const searchName = name.toLowerCase();
    this.searchByNameHelper(this.root, searchName, results);
    
    if (results.length === 0) {
      this.log(`No patients found with name: ${name}`);
    }
    return results;
  }

  private searchByNameHelper(node: Node | null, name: string, results: Patient[]) {
    if (node === null) return;

    this.searchByNameHelper(node.left, name, results);

    if (node.patient.name.toLowerCase().includes(name)) {
      results.push(node.patient);
    }

    this.searchByNameHelper(node.right, name, results);
  }

  public delete(id: number): boolean {
    if (this.searchById(id) === null) {
      this.log(`Error: Patient ID ${id} not found.`);
      return false;
    }
    this.root = this.deleteHelper(this.root, id);
    this.log(`Success: Patient ID ${id} deleted.`);
    return true;
  }

  private deleteHelper(node: Node | null, id: number): Node | null {
    if (node === null) return null;

    if (id < node.patient.patientId) {
      node.left = this.deleteHelper(node.left, id);
    } else if (id > node.patient.patientId) {
      node.right = this.deleteHelper(node.right, id);
    } else {
      if (node.left === null && node.right === null) {
        return null;
      }
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      const successor = this.findMin(node.right);
      node.patient = successor;
      node.right = this.deleteHelper(node.right, successor.patientId);
    }
    return node;
  }

  private findMin(node: Node): Patient {
    while (node.left !== null) {
      node = node.left;
    }
    return node.patient;
  }

  public getAllPatients(): Patient[] {
    const patients: Patient[] = [];
    this.displayInOrder(this.root, patients);
    return patients;
  }

  private displayInOrder(node: Node | null, list: Patient[]) {
    if (node !== null) {
      this.displayInOrder(node.left, list);
      list.push(node.patient);
      this.displayInOrder(node.right, list);
    }
  }

  // Load test data
  public loadTestData() {
    this.insert({ patientId: 101, name: "John Doe", age: 30, gender: "M", medicalHistory: "Flu" });
    this.insert({ patientId: 50, name: "Alice Brown", age: 45, gender: "F", medicalHistory: "Diabetes" });
    this.insert({ patientId: 150, name: "Bob White", age: 60, gender: "M", medicalHistory: "Hypertension" });
    this.insert({ patientId: 75, name: "Charlie Green", age: 12, gender: "M", medicalHistory: "Asthma" });
    this.insert({ patientId: 120, name: "Diana Prince", age: 28, gender: "F", medicalHistory: "Checkup" });
  }
}
