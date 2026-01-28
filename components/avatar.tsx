"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarProps {
    src?: string;
    fallback: string;
}

export function AvatarDemo({ src, fallback }: AvatarProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Avatar>
                <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
        );
    }

    return (
        <Avatar>
            {src ? (
                <AvatarImage src={src} alt="avatar" className="grayscale" />
            ) : (
                <AvatarFallback>{fallback}</AvatarFallback>
            )}
        </Avatar>
    );
}

