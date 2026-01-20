import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/organization/access";

const statement = {
    ...defaultStatements,
    project: ["create", "view", "update", "delete", "upload"],

} as const;

const ac = createAccessControl(statement);

const superAdmin = ac.newRole({
    ...adminAc.statements
});

const admin = ac.newRole({
    project: ["create", "view", "update", "delete", "upload"],
});

const member = ac.newRole({
    project: ["view"],
});

export { ac, superAdmin, admin, member, statement };



