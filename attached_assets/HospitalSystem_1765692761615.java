import java.util.Scanner;

public class HospitalSystem {
    public static void main(String[] args) {
        PatientBST bst = new PatientBST();
        Scanner scanner = new Scanner(System.in);
        
        loadTestData(bst);
        
        System.out.println("HOSPITAL PATIENT MANAGEMENT SYSTEM");
        System.out.println("Created by Moslem Jawich (ID: 22311699766)");

        while (true) {
            printMenu();
            String choice = scanner.nextLine();

            switch (choice) {
                case "1": addPatient(scanner, bst); break;
                case "2": searchById(scanner, bst); break;
                case "3": searchByName(scanner, bst); break;
                case "4": updatePatient(scanner, bst); break;
                case "5": deletePatient(scanner, bst); break;
                case "6": bst.displayAll(); break;
                case "0": 
                    System.out.println("Exiting System. Goodbye!");
                    scanner.close();
                    return;
                default: 
                    System.out.println("Invalid option. Try again.");
            }
        }
    }

    private static void printMenu() {
        System.out.println("\n--- MAIN MENU ---");
        System.out.println("1. Add New Patient");
        System.out.println("2. Search Patient by ID");
        System.out.println("3. Search Patient by Name");
        System.out.println("4. Update Patient Information");
        System.out.println("5. Delete Patient");
        System.out.println("6. Display All Patients");
        System.out.println("0. Exit");
        System.out.print("Enter choice: ");
    }

    private static void addPatient(Scanner sc, PatientBST bst) {
        try {
            System.out.print("Enter ID: ");
            int id = Integer.parseInt(sc.nextLine());
            System.out.print("Enter Name: ");
            String name = sc.nextLine();
            System.out.print("Enter Age: ");
            int age = Integer.parseInt(sc.nextLine());
            System.out.print("Enter Gender: ");
            String gender = sc.nextLine();
            System.out.print("Enter Medical History: ");
            String history = sc.nextLine();

            bst.insert(new Patient(id, name, age, gender, history));
        } catch (NumberFormatException e) {
            System.out.println("Error: ID and Age must be numbers.");
        }
    }

    private static void searchById(Scanner sc, PatientBST bst) {
        System.out.print("Enter ID to search: ");
        try {
            int id = Integer.parseInt(sc.nextLine());
            Patient patient = bst.searchById(id);
            if (patient != null) {
                System.out.println("Record Found:");
                System.out.println(patient);
            } else {
                System.out.println("Record not found.");
            }
        } catch (NumberFormatException e) {
            System.out.println("Invalid ID format.");
        }
    }

    private static void searchByName(Scanner sc, PatientBST bst) {
        System.out.print("Enter Name to search: ");
        String name = sc.nextLine();
        bst.searchByName(name);
    }

    private static void deletePatient(Scanner sc, PatientBST bst) {
        System.out.print("Enter ID to delete: ");
        try {
            int id = Integer.parseInt(sc.nextLine());
            bst.delete(id);
        } catch (NumberFormatException e) {
            System.out.println("Invalid ID format.");
        }
    }

    private static void updatePatient(Scanner sc, PatientBST bst) {
        System.out.print("Enter ID to update: ");
        try {
            int id = Integer.parseInt(sc.nextLine());
            Patient patient = bst.searchById(id);
            
            if (patient == null) {
                System.out.println("Error: Patient not found.");
                return;
            }

            System.out.println("Current Data: " + patient.name + ", Age: " + patient.age + ", History: " + patient.medicalHistory);
            System.out.println("(Press Enter to keep current value)");

            System.out.print("New Name (" + patient.name + "): ");
            String newName = sc.nextLine();
            if (!newName.isEmpty()) patient.name = newName;

            System.out.print("New Age (" + patient.age + "): ");
            String newAgeStr = sc.nextLine();
            if (!newAgeStr.isEmpty()) patient.age = Integer.parseInt(newAgeStr);

            System.out.print("New History (" + patient.medicalHistory + "): ");
            String newHist = sc.nextLine();
            if (!newHist.isEmpty()) patient.medicalHistory = newHist;

            System.out.println("Success: Patient record updated.");
        } catch (NumberFormatException e) {
            System.out.println("Error: Invalid number format.");
        }
    }

    private static void loadTestData(PatientBST bst) {
        bst.insert(new Patient(101, "John Doe", 30, "M", "Flu"));
        bst.insert(new Patient(50, "Alice Brown", 45, "F", "Diabetes"));
        bst.insert(new Patient(150, "Bob White", 60, "M", "Hypertension"));
        bst.insert(new Patient(75, "Charlie Green", 12, "M", "Asthma"));
        bst.insert(new Patient(120, "Diana Prince", 28, "F", "Checkup"));
    }
}

