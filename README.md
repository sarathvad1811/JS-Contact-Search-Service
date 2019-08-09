# Who Am I

A client has asked you to implement an interface to let them search through contacts in their system.
They would like to be able to type into a search bar a name (first, last, nickname), phone number, email, or
role and get back a list of contacts. They have provided you access to their contact list through two entry points:
the access layer service and the access layer update event emitter.

------
Implement the missing contactService as a class or factory function with the following methods:

 - `search(query: String)`: the method requested by the client

Assume that someone else is working on the front end and that a backend service will use your new service to handle
the API request when a search field is typed in on the website. There are already tests written for your service, but
you can feel free to add your own. The time taken to complete this exercise is ignored so please **take as much time
as you need**. We encourage you to refactor your code and try to solve this problem in a way as close to how you would
do it for an official product.

## Documentation

### Access Layer Service

The access layer service (`./accessLayer/index.js -> service`) provides a single method that returns a contact by id.
The service can take some time to respond so it returns a promise of a contact containing all the relevant information
stored under that ID (names, phone numbers, etc.). However, this information is not in the same format requested by the
client and must be mapped to the desired structure.

### Access Layer Update Event Emitter

The access layer update event emitter (`./accessLayer/index.js -> updates`) provides a way to subscribe to the various
types of updates that come through your client's system. It's important to make sure your version of the data is as
update to date as possible. Any emitted event can be one of the following:

 - `add`: indicates a contact has been added to the system and provides the ID of the new contact.
 - `change`: indicates a contact's info has been updated and provides the ID, field, and value of the changed contact.
 - `remove`: indicates a contact has been removed from the system and provides the ID of the removed contact.

* _A new contact will not emit any change events to indicate its initial values._