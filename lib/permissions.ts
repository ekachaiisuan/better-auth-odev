import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/organization/access";

const statement = {
    ...defaultStatements,
    // ทรัพยากรคือ "ไฟล์สำหรับ RAG"
    ragFile: ["upload", "delete", "view"],

    // ทรัพยากรคือ "การแชท"
    chat: ["create", "view", "delete_history"],

    // ทรัพยากรคือ "สมาชิกในองค์กร"
    member: ["invite", "remove", "update", "create"],
} as const;

const ac = createAccessControl(statement);

// กำหนดสิทธิ์ให้แต่ละ Role ตามที่คุณต้องการ
const superAdmin = ac.newRole({
    ragFile: ["upload", "delete", "view"],
    chat: ["create", "view", "delete_history"],
    member: ["invite", "remove", "update", "create"],
});

const admin = ac.newRole({
    ragFile: ["upload", "view", "delete"],
    chat: ["create", "view"],
    member: ["update"]
});

const member = ac.newRole({
    chat: ["create", "view"],
    ragFile: ["view"],
    member: ["update"]
});

export { ac, superAdmin, admin, member, statement };




