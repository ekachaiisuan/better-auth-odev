import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


interface AvatarProps {
    src: string;
    fallback: string;
}

export function AvatarDemo({ src, fallback }: AvatarProps) {
    return (
        <Avatar>
            <AvatarImage
                src={src}
                alt="@shadcn"
                className="grayscale"
            />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    )
}
