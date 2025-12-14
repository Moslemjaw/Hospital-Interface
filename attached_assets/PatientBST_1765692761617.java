public class PatientBST {
    private Node root;

    public void insert(Patient patient) {
        root = insertHelper(root, patient);
    }

    private Node insertHelper(Node node, Patient patient) {
        if (node == null) {
            System.out.println("Success: Patient " + patient.name + " added.");
            return new Node(patient);
        }

        if (patient.patientId < node.patient.patientId) {
            node.left = insertHelper(node.left, patient);
        } else if (patient.patientId > node.patient.patientId) {
            node.right = insertHelper(node.right, patient);
        } else {
            System.out.println("Error: Patient ID " + patient.patientId + " already exists.");
        }
        return node;
    }

    public Patient searchById(int id) {
        return searchByIdHelper(root, id);
    }

    private Patient searchByIdHelper(Node node, int id) {
        if (node == null) return null;
        if (id == node.patient.patientId) return node.patient;
        
        return id < node.patient.patientId 
            ? searchByIdHelper(node.left, id) 
            : searchByIdHelper(node.right, id);
    }

    public void searchByName(String name) {
        String searchName = name.toLowerCase();
        boolean found = searchByNameHelper(root, searchName);
        if (!found) {
            System.out.println("No patients found with name: " + name);
        }
    }

    private boolean searchByNameHelper(Node node, String name) {
        if (node == null) return false;

        boolean found = searchByNameHelper(node.left, name);
        
        if (node.patient.name.toLowerCase().contains(name)) {
            System.out.println(node.patient);
            found = true;
        }
        
        return searchByNameHelper(node.right, name) || found;
    }

    public void delete(int id) {
        if (searchById(id) == null) {
            System.out.println("Error: Patient ID " + id + " not found.");
            return;
        }
        root = deleteHelper(root, id);
        System.out.println("Success: Patient ID " + id + " deleted.");
    }

    private Node deleteHelper(Node node, int id) {
        if (node == null) return null;

        if (id < node.patient.patientId) {
            node.left = deleteHelper(node.left, id);
        } else if (id > node.patient.patientId) {
            node.right = deleteHelper(node.right, id);
        } else {
            if (node.left == null && node.right == null) {
                return null;
            }
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;

            Patient successor = findMin(node.right);
            node.patient = successor;
            node.right = deleteHelper(node.right, successor.patientId);
        }
        return node;
    }

    private Patient findMin(Node node) {
        while (node.left != null) {
            node = node.left;
        }
        return node.patient;
    }

    public void displayAll() {
        if (root == null) {
            System.out.println("No records found.");
            return;
        }
        System.out.println("\n--- All Patient Records (Sorted by ID) ---");
        displayInOrder(root);
        System.out.println("------------------------------------------");
    }

    private void displayInOrder(Node node) {
        if (node != null) {
            displayInOrder(node.left);
            System.out.println(node.patient);
            displayInOrder(node.right);
        }
    }
}

