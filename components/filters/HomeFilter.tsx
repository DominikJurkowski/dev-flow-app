'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formUrlQuery, removeKeyFromQuery } from '@/lib/url';

const filters = [
    { name: 'React', value: 'react' },
    { name: 'Javascript', value: 'javascript' },
//   { name: 'Newest', value: 'newest' },
//   { name: 'Popular', value: 'popular' },
//   { name: 'Unanswered', value: 'unanswered' },
//   { name: 'Recommended', value: 'recommended' },
];

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const [active, setActive] = useState(filter || '');

  const handleFilter = (value: string) => {
    let newUrl = '';
    if (value) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: value,
      });
      setActive(value);
    } else {
      setActive('');
      newUrl = removeKeyFromQuery({
        params: searchParams.toString(),
        keyToRemove: ['filter'],
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant="outline"
          className={cn(
            'body-medium cursor-pointer rounded-lg px-6 py-3 capitalize shadow-none',
            active === filter.value ? 'bg-light-850 text-light-900' : 'text-light-500'
          )}
          onClick={() => handleFilter(active === filter.value ? '' : filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
