// enum defines a set of named constants

enum UserRole {
    Admin,
    Editor,
    Viewer
}

function checkAccess(role: UserRole) {
    if (role === UserRole.Admin) {
        console.log("full access");
    } else {
        console.log("limited access");
    }
}

checkAccess(UserRole.Admin);
checkAccess(UserRole.Viewer);
