import { usePwaUpdate } from '@/lib/usePwaUpdate';
import { motion, AnimatePresence } from 'framer-motion';

export const PwaUpdatePrompt = () => {
  const { newVersionAvailable, skipWaiting } = usePwaUpdate();

  return (
    <AnimatePresence>
      {newVersionAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 bg-neo-primary p-4 rounded-lg shadow-neo"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-neo-text">Phiên bản mới có sẵn</h3>
              <p className="text-sm text-neo-text opacity-75">
                Nhấn cập nhật để sử dụng phiên bản mới nhất
              </p>
            </div>
            <button
              onClick={skipWaiting}
              className="px-4 py-2 bg-neo-main text-white rounded font-semibold hover:shadow-neo-hover transition-shadow"
            >
              Cập nhật
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
