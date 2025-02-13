module.exports = class UserDto {
    email;
    id;
    isActivated;
    firstName;
    lastName;
    city;
    teamStatus;
    phoneNumber;
    profilePhoto;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.city = model.city;
        this.teamStatus = model.teamStatus;
        this.phoneNumber = model.phoneNumber;
        this.photo = model.profilePhoto;
    }
};
