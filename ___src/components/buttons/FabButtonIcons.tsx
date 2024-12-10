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

const FabButtonIcons = () => {
  const [isFabEnabled, setIsFabEnabled] = useState(false);

  const toggleFAB = useCallback(() => {
    setIsFabEnabled((prevState) => !prevState);
  }, []);

  return (
    // FAB button container
    <div className='bg-primary h-16 w-16 rounded-full p-0.5 rounded-br-md fixed bottom-5 right-5 flex items-center justify-center shadow-primary shadow-sm hover:shadow-md hover:shadow-primary cursor-pointer active:scale-95 transition-all ease-in'>
      <div
        onClick={toggleFAB}
        className={`select-none secondaryBorderThick rounded-full w-full h-full flex items-center justify-center transition-transform ease-in ${
          isFabEnabled ? 'rotate-[315deg]' : ''
        }`}
      >
        {/* FAB button icon */}
        <PlusIcon className='floater__btn-icon floater__btn-icon-plus text-white' />
        {/* <svg
          className='floater__btn-icon floater__btn-icon-plus'
          width='18px'
          height='18px'
          viewBox='672 53 24 24'
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
        >
          
        </svg> */}
      </div>

      {/* FAB button list */}
      <AnimatePresence>
        {isFabEnabled && (
          <motion.ul
            variants={container}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='absolute bottom-20 flex justify-between flex-col items-center gap-2'
          >
            {/* List item A */}
            <motion.li
              variants={itemA}
              className='flex items-center justify-center h-14 w-14 rounded-full bg-flag-green text-white'
            >
              <PhoneCall className='text-white' />
            </motion.li>

            {/* List item B */}
            <motion.li
              variants={itemB}
              className='flex items-center justify-center h-14 w-14 rounded-full bg-flag-yellow'
            >
              <MailIcon className='text-flag-green' />
            </motion.li>

            {/* List item C */}
            <motion.li
              variants={itemC}
              className='flex items-center justify-center h-14 w-14 rounded-full bg-flag-red'
            >
              <MessageSquare className='text-white' />
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FabButtonIcons;
