'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Button } from '@/components/ui/button';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onDelete?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  showDeleteButton?: boolean;
  isSubmitDisabled?: boolean;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  onDelete,
  submitLabel = 'SUBMIT',
  cancelLabel = 'CANCEL',
  showDeleteButton = false,
  isSubmitDisabled = false,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop overlay */}
      <div
        className='fixed inset-0 bg-black/50'
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div
        className={`relative flex min-h-screen items-center justify-center p-4`}
      >
        <div
          role='dialog'
          aria-modal='true'
          className={`relative w-full max-w-md overflow-hidden rounded-[20px] bg-white shadow-lg`}
        >
          <VisuallyHidden>
            <h2 id='dialog-title'>{title}</h2>
          </VisuallyHidden>

          {/* Header */}
          <div
            className={`flex items-center justify-between bg-[#0C2C47] p-4 px-6 text-white`}
          >
            <h2 className='text-sm font-semibold'>{title}</h2>
            <button
              onClick={onClose}
              className={`text-white hover:text-gray-200`}
              aria-label='Close'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>
          </div>

          {/* Form content */}
          <div className='p-5'>
            <div className='space-y-6'>{children}</div>

            {/* Footer */}
            <div className='flex justify-between pt-6'>
              {showDeleteButton && onDelete && (
                <Button
                  variant='destructive'
                  size='icon'
                  className={`rounded-[5px] border-none bg-[#FF7D4E] px-6 text-white hover:bg-[#FF7D4E]/90`}
                  onClick={onDelete}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M3 6h18'></path>
                    <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'></path>
                    <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'></path>
                    <line x1='10' y1='11' x2='10' y2='17'></line>
                    <line x1='14' y1='11' x2='14' y2='17'></line>
                  </svg>
                </Button>
              )}

              <div
                className={`flex space-x-2 ${!showDeleteButton ? 'ml-auto' : ''}`}
              >
                <Button
                  variant='outline'
                  onClick={onClose}
                  className={`h-8 rounded-[5px] border-gray-300 px-4 text-xs text-gray-700`}
                >
                  {cancelLabel}
                </Button>
                {onSubmit && (
                  <Button
                    className={`h-8 rounded-[5px] border-none bg-[#FF7D4E] px-4 text-xs text-white hover:bg-[#FF7D4E]/90`}
                    onClick={onSubmit}
                    disabled={isSubmitDisabled}
                  >
                    {submitLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
