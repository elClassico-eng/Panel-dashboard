module.exports = class UserDto {
    email;
    id;
    firstName;
    lastName;
    profilePhoto;
    role;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.profilePhoto = model.profilePhoto;
        this.role = model.role;
    }
};
