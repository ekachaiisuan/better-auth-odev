import { createAccessControl } from "better-auth/plugins/access";

const statement = {
    // ทรัพยากรคือ "ไฟล์สำหรับ RAG"
    ragFile: ["upload", "delete", "view"],

    // ทรัพยากรคือ "การแชท"
    chat: ["create", "view", "delete_history"],

    // ทรัพยากรคือ "สมาชิกในองค์กร"
    member: ["invite", "remove", "update_role"],
} as const;

const ac = createAccessControl(statement);

// กำหนดสิทธิ์ให้แต่ละ Role ตามที่คุณต้องการ
const superAdminRole = ac.newRole({
    ragFile: ["upload", "delete", "view"],
    chat: ["create", "view", "delete_history"],
    member: ["invite", "remove", "update_role"],
});

const adminRole = ac.newRole({
    ragFile: ["upload", "view", "delete"],
    chat: ["create", "view"],
});

const userRole = ac.newRole({
    chat: ["create", "view"],
    ragFile: ["view"],
});

export { ac, superAdminRole, adminRole, userRole, statement };




