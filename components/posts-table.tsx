import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import posts from "@/db/posts";

interface PostsTableProps {
    limit?: number;
    title?: string;
}

const PostsTable = ({ limit, title }: PostsTableProps) => {
    const filteredPosts = limit ? posts.slice(0, limit) : posts;

    return (
        <div className="mt-10">
            <h3 className="text-2xl mb-4 font-semibold">{title ? title : "Posts"}</h3>
            <Table>
                <TableCaption>{limit ? `Showing last ${limit} posts` : "Showing all posts"}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Author</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden md:table-cell">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell>{post.title}</TableCell>
                            <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                            <TableCell className="hidden md:table-cell">{post.date}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Link href={`/posts/${post.id}`}>View</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default PostsTable;