import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { MailIcon, MessageSquare, PhoneCall, PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

const container = {
  hidden: {
    translateY: 50,
    opacity: 0,
  },
  show: {
    translateY: 0,
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemA = {
  hidden: { translateY: 25, opacity: 0 },
  show: { translateY: 0, opacity: 1 },
};

const itemB = {
  hidden: { translateY: 25, opacity: 0 },
  show: { translateY: 0, opacity: 1 },
};

const itemC = {
  hidden: { translateY: 25, opacity: 0 },
  show: { translateY: 0, opacity: 1 },
};

const FabButton = ({ children, onClick, className }: any) => {
  return (
    // FAB button container
    <Button
      onClick={onClick}
      className={cn(
        'z-50 rounded-full rounded-br-md fixed bottom-5 right-5 flex items-center justify-center shadow-primary shadow-sm hover:shadow-md hover:shadow-primary cursor-pointer active:scale-95 transition-all ease-in',
        className || 'bg-primary h-16 w-16 p-0.5 '
      )}
    >
      <div className='select-none secondaryBorderThick rounded-full w-full h-full flex items-center justify-center transition-transform ease-in'>
        {children || (
          <PlusIcon className='floater__btn-icon floater__btn-icon-plus' />
        )}
      </div>
    </Button>
  );
};

export default FabButton;
