import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import type { Conversation } from '../types/chat';

export const Route = createFileRoute('/history')({
  component: HistoryPage,
});

const CONVERSATIONS_KEY = 'tanstack-ai-conversations';

function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Conversation[];
    return parsed.map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
      messages: c.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch {
    return [];
  }
}

const columnHelper = createColumnHelper<Conversation>();

function HistoryPage() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'updatedAt', desc: true }]);
  const conversations = useMemo(() => loadConversations(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => (
          <span className="font-medium text-gray-800">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor((row) => row.messages.length, {
        id: 'messageCount',
        header: 'Messages',
        cell: (info) => (
          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-sm font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created',
        cell: (info) => (
          <span className="text-gray-500 text-sm">
            {info.getValue().toLocaleDateString()} {info.getValue().toLocaleTimeString()}
          </span>
        ),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Last Updated',
        cell: (info) => (
          <span className="text-gray-500 text-sm">
            {info.getValue().toLocaleDateString()} {info.getValue().toLocaleTimeString()}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: () => (
          <button
            onClick={() => void navigate({ to: '/chat' })}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline transition-colors"
          >
            View Chat →
          </button>
        ),
      }),
    ],
    [navigate]
  );

  const table = useReactTable({
    data: conversations,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Conversation History</h1>
        <p className="text-gray-500 text-sm mt-1">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} stored locally
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <span className="text-5xl block mb-3">💬</span>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">No conversations yet</h2>
          <p className="text-gray-400 text-sm">Start a chat to see your history here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && ' ↑'}
                        {header.column.getIsSorted() === 'desc' && ' ↓'}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
