import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  text: string;
  labelText?: string;
  iconOnly?: boolean;
}

export default function CopyButton({
  text,
  labelText,
  iconOnly = false,
}: CopyButtonProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      size='sm'
      variant='outline'
      onClick={copyToClipboard}
      className='px-3 py-2 text-xs'
    >
      {copySuccess ? (
        iconOnly ? (
          <CheckIcon className='h-4 w-4 text-green-600' />
        ) : (
          <span className='text-green-600'>Copied!</span>
        )
      ) : (
        <>
          <CopyIcon className='h-4 w-4' />
          {labelText}
        </>
      )}
    </Button>
  );
}
