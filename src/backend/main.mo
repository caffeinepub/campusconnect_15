import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Zone {
    public type Type = {
      #blockA;
      #blockB;
      #lab;
      #foodCourt;
      #library;
      #parking;
    };
  };

  public type Teacher = {
    name : Text;
    id : Text;
    email : Text;
    isAvailable : Bool;
    locationZone : ?Zone.Type;
    isOnCampus : Bool;
  };

  public type Student = {
    name : Text;
    id : Text;
    email : Text;
  };

  public type UserProfile = {
    role : { #teacher; #student };
    name : Text;
  };

  let teachers = Map.empty<Principal, Teacher>();
  let students = Map.empty<Principal, Student>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper function to check if caller is a registered teacher
  private func isTeacher(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#teacher) { true };
          case (#student) { false };
        };
      };
      case (null) { false };
    };
  };

  // Helper function to check if caller is a registered student
  private func isStudent(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#student) { true };
          case (#teacher) { false };
        };
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func registerTeacher(name : Text, id : Text, email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as a teacher");
    };

    // Check if user is already registered with any role
    switch (userProfiles.get(caller)) {
      case (?profile) {
        Runtime.trap("User already registered as " # debug_show(profile.role));
      };
      case (null) {};
    };

    let teacher : Teacher = {
      name;
      id;
      email;
      isAvailable = false;
      locationZone = null;
      isOnCampus = false;
    };

    let profile : UserProfile = {
      role = #teacher;
      name;
    };

    teachers.add(caller, teacher);
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func registerStudent(name : Text, id : Text, email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as a student");
    };

    // Check if user is already registered with any role
    switch (userProfiles.get(caller)) {
      case (?profile) {
        Runtime.trap("User already registered as " # debug_show(profile.role));
      };
      case (null) {};
    };

    let student : Student = {
      name;
      id;
      email;
    };

    let profile : UserProfile = {
      role = #student;
      name;
    };

    students.add(caller, student);
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func toggleAvailability(isAvailable : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can modify availability");
    };

    // Verify caller is a registered teacher
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can modify availability");
    };

    switch (teachers.get(caller)) {
      case (?teacher) {
        let updatedTeacher : Teacher = {
          teacher with
          isAvailable;
        };
        teachers.add(caller, updatedTeacher);
      };
      case (null) {
        Runtime.trap("Teacher profile not found");
      };
    };
  };

  public shared ({ caller }) func setLocationZone(zone : Zone.Type) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can set location zone");
    };

    // Verify caller is a registered teacher
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can set location zone");
    };

    switch (teachers.get(caller)) {
      case (?teacher) {
        let updatedTeacher : Teacher = {
          teacher with
          locationZone = ?zone;
        };
        teachers.add(caller, updatedTeacher);
      };
      case (null) {
        Runtime.trap("Teacher profile not found");
      };
    };
  };

  public shared ({ caller }) func setCampusPresence(isOnCampus : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can set campus presence");
    };

    // Verify caller is a registered teacher
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can set campus presence");
    };

    switch (teachers.get(caller)) {
      case (?teacher) {
        let updatedTeacher : Teacher = {
          teacher with
          isOnCampus;
          isAvailable = if (isOnCampus) {
            teacher.isAvailable;
          } else {
            false;
          };
        };
        teachers.add(caller, updatedTeacher);
      };
      case (null) {
        Runtime.trap("Teacher profile not found");
      };
    };
  };

  public query ({ caller }) func getAllTeachers() : async [Teacher] {
    // Anyone can view teachers list (including guests)
    teachers.values().toArray();
  };

  public query ({ caller }) func searchTeachersByName(searchString : Text) : async [Teacher] {
    // Anyone can search teachers (including guests)
    let result = teachers.values();
    let filtered = result.filter(
      func(teacher) {
        teacher.name.toLower().contains(
          #text(searchString.toLower())
        );
      }
    );
    let filteredArray = filtered.toArray();

    module Teacher {
      public func compareByName(t1 : Teacher, t2 : Teacher) : Order.Order {
        Text.compare(t1.name, t2.name);
      };
    };

    filteredArray.sort(Teacher.compareByName);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    // Verify the role matches existing registration
    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        // Cannot change role after registration
        switch (existingProfile.role, profile.role) {
          case (#teacher, #teacher) {};
          case (#student, #student) {};
          case _ {
            Runtime.trap("Cannot change user role after registration");
          };
        };
      };
      case (null) {
        Runtime.trap("User must register first before updating profile");
      };
    };

    userProfiles.add(caller, profile);
  };
};
