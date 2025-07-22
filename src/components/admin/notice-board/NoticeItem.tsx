import { motion } from 'framer-motion';
import { Edit2, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { Notice } from '../../../types';
import { useTranslation } from '../../../i18n/useTranslation';
import { formatMarkdown } from '../../../utils/markdown';

interface NoticeItemProps {
  notice: Notice;
  index: number;
  totalNotices: number;
  onEdit: (notice: Notice) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

export function NoticeItem({ notice, index, totalNotices, onEdit, onDelete, onMove }: NoticeItemProps) {
  const { language } = useTranslation();

  // Get content based on language
  const title = typeof notice.title === 'object' ? notice.title[language] : notice.title;
  const content = typeof notice.content === 'object' ? notice.content[language] : notice.content;
  const formattedContent = content ? formatMarkdown(content) : '';

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="px-2 py-3 sm:p-4 hover:bg-gray-50"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          {notice.images && notice.images.length > 0 && (
            <div className="flex -space-x-2 flex-shrink-0">
              {notice.images.slice(0, 3).map((image, imgIndex) => (
                <div key={imgIndex} className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border-2 border-white">
                  <img
                    src={image}
                    alt={`${title} - ${imgIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              {notice.images.length > 3 && (
                <div className="h-12 w-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center">
                  <span className="text-sm text-gray-600">+{notice.images.length - 3}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {title}
            </h3>
            {content && (
              <div 
                className="text-sm text-gray-500 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center mt-3 sm:mt-0">
          <button
            onClick={() => onMove(notice.id, 'up')}
            disabled={index === 0}
            className={`p-1 rounded-lg hover:bg-gray-100 ${
              index === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <MoveUp className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={() => onMove(notice.id, 'down')}
            disabled={index === totalNotices - 1}
            className={`p-1 rounded-lg hover:bg-gray-100 ${
              index === totalNotices - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <MoveDown className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={() => onEdit(notice)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <Edit2 className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(notice.id)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
    </motion.li>
  );
}