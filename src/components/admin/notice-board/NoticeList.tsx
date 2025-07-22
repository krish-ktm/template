import { Notice } from '../../../types';
import { NoticeItem } from './NoticeItem';

interface NoticeListProps {
  notices: Notice[];
  onEdit: (notice: Notice) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

export function NoticeList({ notices, onEdit, onDelete, onMove }: NoticeListProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200 max-w-full overflow-x-auto">
        {notices.map((notice, index) => (
          <NoticeItem
            key={notice.id}
            notice={notice}
            index={index}
            totalNotices={notices.length}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}

        {notices.length === 0 && (
          <li className="p-8 text-center text-gray-500">
            No notices have been created yet.
          </li>
        )}
      </ul>
    </div>
  );
}