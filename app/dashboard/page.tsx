import DashboardCard from "@/components/dashboard-card";
import { Newspaper, Folder, Users, MessageSquare } from "lucide-react";
import PostsTable from "@/components/posts-table";
import AnalyticsChart from "@/components/analytics-chart";

export default function Dashboard() {
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between gap-2 mb-5">
                <DashboardCard
                    title="POSTS"
                    value={100}
                    icon={<Newspaper className="text-slate-500" size={72} />}
                />
                <DashboardCard
                    title="Categories"
                    value={50}
                    icon={<Folder className="text-slate-500" size={72} />}
                />
                <DashboardCard
                    title="Users"
                    value={20}
                    icon={<Users className="text-slate-500" size={72} />}
                />
                <DashboardCard
                    title="Comments"
                    value={1200}
                    icon={<MessageSquare className="text-slate-500" size={72} />}
                />
            </div>
            <PostsTable limit={5} title="Latest Posts" />
            <AnalyticsChart />
        </>

    );
}