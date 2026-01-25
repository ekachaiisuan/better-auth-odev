import { getCurrentUser } from "@/server/users"

export default async function UserProfile() {
    const user = await getCurrentUser()
    const { currentUser, session } = user

    return (
        <div className="space-y-4">
            {/* USER */}
            <section className="rounded-lg border p-4">
                <h2 className="font-semibold text-lg">👤 ข้อมูลผู้ใช้</h2>

                <p><b>ID:</b> {currentUser.id}</p>
                <p><b>ชื่อ:</b> {currentUser.name}</p>
                <p><b>Email:</b> {currentUser.email}</p>
                <p>
                    <b>Email verified:</b>{" "}
                    {currentUser.emailVerified ? "✅ ยืนยันแล้ว" : "❌ ยังไม่ยืนยัน"}
                </p>

                {currentUser.image && (
                    <img
                        src={currentUser.image}
                        alt={currentUser.name}
                        className="w-20 h-20 rounded-full mt-2"
                    />
                )}
            </section>

            {/* SESSION */}
            <section className="rounded-lg border p-4">
                <h2 className="font-semibold text-lg">🔐 Session</h2>

                <p><b>Session ID:</b> {session.id}</p>
                <p><b>User ID:</b> {session.userId}</p>
                <p><b>หมดอายุ:</b> {session.expiresAt.toLocaleString()}</p>

                {session.activeOrganizationId ? (
                    <p>
                        <b>Active Org:</b> {session.activeOrganizationId}
                    </p>
                ) : (
                    <p>
                        <b>Active Org:</b> No active organization
                    </p>
                )}

                {session.ipAddress ? (
                    <p><b>IP:</b> {session.ipAddress}</p>
                ) : (
                    <p>
                        <b>IP:</b> No IP address
                    </p>
                )}

                {session.userAgent ? (
                    <p className="break-all">
                        <b>Browser:</b> {session.userAgent}
                    </p>
                ) : (
                    <p>
                        <b>Browser:</b> No browser
                    </p>
                )}
            </section>
        </div>
    );
}
