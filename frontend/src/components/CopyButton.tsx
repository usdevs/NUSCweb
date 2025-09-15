import { Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  text: string;
  labelText?: string;
}

export default function CopyButton({ text, labelText }: CopyButtonProps) {
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
        <span className='text-green-600'>Copied!</span>
      ) : (
        <>
          <Copy className='h-4 w-4' />
          {labelText}
        </>
      )}
    </Button>
  );
}
