import { useState, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function UploadBox({ onFileSelected, label = "Arraste e solte o PDF aqui ou clique para selecionar" }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return null;
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Por favor, selecione um arquivo PDF.');
      return null;
    }
    setError('');
    return selectedFile;
  };

  const handleFile = (selectedFile) => {
    const validFile = validateFile(selectedFile);
    if (validFile) {
      setFile(validFile);
      onFileSelected(validFile);
    } else {
      setFile(null);
      onFileSelected(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
    e.target.value = ''; // permite selecionar o mesmo arquivo novamente
  };

  const clearFile = () => {
    setFile(null);
    setError('');
    onFileSelected(null);
  };

      return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleInputChange}
        />
        
        {!file ? (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">{label}</p>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}