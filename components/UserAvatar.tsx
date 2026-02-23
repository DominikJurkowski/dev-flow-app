import ROUTES from '@/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';

const UserAvatar = ({ id, name, image }: { id: string; name?: string | null; image?: string | null }) => {
  const initials = name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className="h-9 w-9">
        {image ? (
          <Image src={image} alt={name || ''} width={36} height={36} className="object-cover" quality={100} />
        ) : (
          <AvatarFallback className="primary-gradient font-space-grotesk font-bold tracking-wider text-white" > 
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
