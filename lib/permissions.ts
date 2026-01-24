import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/organization/access";

const statement = {
    ...defaultStatements,
    project: ["create", "view", "update", "delete", "upload"],

} as const;

const ac = createAccessControl(statement);

const admin = ac.newRole({
    project: ["create", "view", "update", "delete", "upload"],
});

const member = ac.newRole({
    project: ["view"],
});

const owner = ac.newRole({
    project: ["create", "update", "delete"],
    organization: ["update", "delete"],
});

export { ac, admin, member, owner, statement };



