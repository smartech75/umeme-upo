'use client';

import { useEffect, useState } from 'react';

// Local imports
import { Language, Status } from '@/types/general';
import { Icons } from '@/components/icons';
import { getQuotes } from '@/lib/utils';

export default function SocialShare({
  paramLocation,
  language,
  status,
}: {
  paramLocation: string;
  language: Language;
  status: Status;
}) {
  useEffect(() => {
    const updatedQuote = getQuotes(paramLocation, status);
    if (updatedQuote) {
      setQuote(language === 'en' ? updatedQuote.en : updatedQuote.sw);
    }
  }, [status, language, paramLocation]);

  const [quote, setQuote] = useState<string | null>(null);

  return (
    <div className='flex flex-col items-center justify-center'>
      {status !== 'unknown' && quote && (
        <>
          <h4 className='mb-8 max-w-[70%] break-before-auto break-after-auto text-center font-bold sm:text-2xl md:text-xl'>
          &quot; {quote} &quot;
          </h4>
          <div className='flex flex-row items-center justify-center '>
            <Icons.twitter className='mb-4 mr-4 h-4 w-4 ' />
            <span className='mb-4 mr-4 h-5 w-4'>Twitter</span>
          </div>
        </>
      )}
    </div>
  );
}
