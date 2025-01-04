import React from 'react';
import { Download } from 'lucide-react';
import { Transaction } from '../types/transaction';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface ExportButtonProps {
  transactions: Transaction[];
}

export default function ExportButton({ transactions }: ExportButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={buttonRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => {
                exportToCSV(transactions);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as CSV
            </button>
            <button
              onClick={() => {
                exportToPDF(transactions);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}