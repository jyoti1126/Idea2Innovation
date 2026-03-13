import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { getBookDetailApi } from '@/api/learningApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getBookDetailApi(id);
        setBook(res.data.book || res.data);
      } catch {} finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>;
  if (!book) return null;

  const pdfUrl = book.pdfUrl || book.pdf;

  return (
    <div className="fade-up max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#6B7280] font-body text-sm mb-4 hover:text-brand">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="font-heading text-xl font-bold text-[#1E1B4B] mb-4">{book.title}</h1>

      {/* Controls */}
      <div className="bg-card rounded-xl shadow-card border border-[#EDE9FE] p-3 flex items-center justify-between mb-4 sticky top-16 z-20">
        <div className="flex items-center gap-2">
          <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1} className="p-1.5 rounded-lg hover:bg-surface disabled:opacity-30"><ChevronLeft size={18} /></button>
          <span className="text-sm font-body text-[#1E1B4B]">Page {pageNumber} of {numPages}</span>
          <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages} className="p-1.5 rounded-lg hover:bg-surface disabled:opacity-30"><ChevronRight size={18} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(s => Math.max(0.6, s - 0.1))} className="p-1.5 rounded-lg hover:bg-surface"><ZoomOut size={16} /></button>
          <span className="text-xs font-body text-[#6B7280] w-10 text-center">{scale.toFixed(1)}x</span>
          <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="p-1.5 rounded-lg hover:bg-surface"><ZoomIn size={16} /></button>
          {pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-surface text-[#6B7280]"><Download size={16} /></a>
          )}
        </div>
      </div>

      {/* PDF */}
      <div className="flex justify-center">
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={<LoadingSpinner />}
            error={
              <div className="text-center py-12">
                <p className="text-[#6B7280] font-body mb-3">Failed to load PDF.</p>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-brand font-body font-semibold hover:underline flex items-center justify-center gap-1"><Download size={16} /> Download instead</a>
              </div>
            }
          >
            <Page pageNumber={pageNumber} scale={scale} className="shadow-card rounded-lg overflow-hidden" />
          </Document>
        ) : (
          <p className="text-[#6B7280] font-body">No PDF available</p>
        )}
      </div>
    </div>
  );
};

export default BookReaderPage;
