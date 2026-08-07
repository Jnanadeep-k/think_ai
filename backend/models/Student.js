class Student {
    constructor({
        id,
        firstName,
        lastName,
        email,
        phone,
        gender,
        dateOfBirth,
        address,
        city,
        state,
        pincode,
        qualification,
        status
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.qualification = qualification;
        this.status = status;
    }
}

module.exports = Student;