export default class {
  constructor(updates, service) {
    this.contactList = [];
    this.service = service;

    updates.on("add", this.contactAdded.bind(this));
    updates.on("change", this.contactChanged.bind(this));
    updates.on("remove", this.contactRemoved.bind(this));
  }

  // event listener handlers
  contactAdded(id) {
    // push to contacts after getting the details
    this.service.getById(id).then(contactDetails => {
      this.contactList.push(contactDetails);
    });
  }

  contactChanged(id, field, value) {
    // travserse and change that value
    this.contactList.map(each => {
      if (each.id === id) {
        each[field] = value;
      }

      return each;
    });
  }

  contactRemoved(id) {
    // remove from the contact list array
    this.contactList = this.contactList.filter(contact => contact.id !== id);
  }

  search(query) {
    let resultsArr = [];
    const phoneNumKeys = ["primaryPhoneNumber", "secondaryPhoneNumber"];

    // iterate through the list of contacts and check if the query str matches any of the value
    resultsArr = this.contactList.filter(each => {
      let found = false;

      for (const eachKey in each) {
        if (phoneNumKeys.indexOf(eachKey) !== -1) {
          const userInput = query.replace(/\D+/g, "");
          const sanitizedNum = each[eachKey].replace(/\D+/g, "");
          if (userInput !== "") {
            if (sanitizedNum.indexOf(userInput) !== -1) {
              found = true;
              break;
            }
          }
        } else if (
          `${each.firstName} ${each.lastName}` === query ||
          `${each.nickName} ${each.lastName}` === query
        ) {
          found = true;
          break;
        } else if (each[eachKey] && each[eachKey].indexOf(query) !== -1) {
          found = true;
          break;
        }
      }

      return found;
    });

    return resultsArr.map(result => this.formatResults(result));
  }

  formatResults(contactObj) {
    return {
      name:
        contactObj.nickName !== ""
          ? `${contactObj.nickName} ${contactObj.lastName}`
          : `${contactObj.firstName} ${contactObj.lastName}`,
      phones: this.getPhoneNumbers([
        contactObj.primaryPhoneNumber,
        contactObj.secondaryPhoneNumber
      ]),
      email: contactObj.emailAddress || contactObj.primaryEmail || "",
      address: contactObj.address || "",
      role: contactObj.role || "",
      id: contactObj.id
    };
  }

  getPhoneNumbers(p) {
    let phoneNumsList = [];

    p.map(each => {
      if (each !== "") {
        phoneNumsList.push(this.formatPhoneNumber(each));
      }
    });

    return phoneNumsList;
  }

  formatPhoneNumber(phoneNumber) {
    // (xxx) xxx-xxxx
    if (phoneNumber.indexOf("+1") !== -1) {
      // remove +1 and format
      phoneNumber = phoneNumber.substring(2);
    }
    // remove everything except digits ()-+ etc
    phoneNumber = phoneNumber.replace(/\D+/g, "");

    return phoneNumber.replace(/^(\d{3})(\d{3})(\d{4}).*/, "($1) $2-$3");
  }
}
