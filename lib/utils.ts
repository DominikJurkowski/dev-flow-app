import { techMap } from '@/constants/techMap';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, '').toLowerCase();

  return techMap[normalizedTechName] ? `${techMap[normalizedTechName]} colored` : 'devicon-devicon-plain';
};

export const getTimeStamp = (date: Date) => {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { lable: 'year', seconds: 31536000 },
    { lable: 'month', seconds: 2592000 },
    { lable: 'day', seconds: 86400 },
    { lable: 'hour', seconds: 3600 },
    { lable: 'minute', seconds: 60 },
    { lable: 'second', seconds: 1 },
  ];

  for (const unit of units) {
    const value = Math.floor(secondsAgo / unit.seconds);
    if (value >= 1) {
      return `${value} ${unit.lable}${value > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};
