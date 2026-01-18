import MemberTable from "@/components/member-table";
import { getOrganizationBySlug } from "@/server/organizations";
import { getUsers } from "@/server/users";

type Params = Promise<{ slug: string }>;

export default async function OrganizationPage({ params }: { params: Params }) {
    const { slug } = await params;

    const [organization, users] = await Promise.all([
        getOrganizationBySlug(slug),
        getUsers(slug),
    ]);

    return (
        <div className="mx-auto flex flex-col max-w-3xl gap-4 py-10 px-4">
            <h1 className="font-bold text-2xl">{organization?.name}</h1>
            <MemberTable members={organization?.members || []} />
        </div>
    );
}