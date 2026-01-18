import { User } from "@/db/schema";
import { Button } from "@/components/ui/button";

interface AllUserProps {
    users: User[];
}

export default function AllUser({ users }: AllUserProps) {
    return (
        <div>
            <h1>All User</h1>
            <div className="flex flex-col gap-2">
                {users.map((user) => (
                    <div key={user.id}>
                        {user.name}
                        <Button variant="outline">Add Organization</Button>
                    </div>
                ))}
            </div>
        </div>
    );
}