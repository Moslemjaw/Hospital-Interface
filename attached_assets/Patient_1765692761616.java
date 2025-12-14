public class Patient {
    int patientId;
    String name;
    int age;
    String gender;
    String medicalHistory;

    public Patient(int patientId, String name, int age, String gender, String medicalHistory) {
        this.patientId = patientId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.medicalHistory = medicalHistory;
    }

    @Override
    public String toString() {
        return "---------------------------------\n" +
               "ID: " + patientId + "\n" +
               "Name: " + name + "\n" +
               "Age: " + age + "\n" +
               "Gender: " + gender + "\n" +
               "History: " + medicalHistory + "\n" +
               "---------------------------------";
    }
}

