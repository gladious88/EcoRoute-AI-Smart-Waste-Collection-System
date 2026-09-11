import React, { useState } from 'react';
import { api } from '../services/api';
import { WasteAnalysisResult } from '../types';
import { ScanSearch, Upload, Image as ImageIcon, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const WasteDetectionPage: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<string | null>('overflow_bin');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800');
  const [analysis, setAnalysis] = useState<WasteAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const samplePresets = [
    {
      id: 'overflow_bin',
      name: 'Overflowing Bin',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800'
    },
    {
      id: 'plastic_heap',
      name: 'Plastic Heap',
      url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800'
    },
    {
      id: 'normal_bin',
      name: 'Normal Bin',
      url: 'https://images.unsplash.com/photo-1604186837056-8e7c286756f2?w=800'
    }
  ];

  const handleRunAnalysis = async (sampleId?: string, file?: File) => {
    setAnalyzing(true);
    const res = await api.analyzeWaste(sampleId, file);
    setAnalysis(res);
    setAnalyzing(false);
  };

  const handleSelectSample = (sample: typeof samplePresets[0]) => {
    setSelectedSample(sample.id);
    setUploadedFile(null);
    setPreviewUrl(sample.url);
    handleRunAnalysis(sample.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setSelectedSample(null);
      setPreviewUrl(URL.createObjectURL(file));
      handleRunAnalysis(undefined, file);
    }
  };

  // Run initial analysis on mount
  React.useEffect(() => {
    handleRunAnalysis('overflow_bin');
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ScanSearch className="h-7 w-7 text-emerald-600" />
            <span>Computer Vision Waste Detection</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Automated image classification & overflow risk assessment using deep feature extraction
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Sample Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Upload or Select Waste Photo</h3>

            {/* Sample Selector Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {samplePresets.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`flex flex-col items-center rounded-xl p-2 text-center border transition ${
                    selectedSample === sample.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <img src={sample.url} alt={sample.name} className="h-14 w-full object-cover rounded-lg mb-1.5" />
                  <span className="text-[11px] leading-tight truncate w-full">{sample.name}</span>
                </button>
              ))}
            </div>

            {/* Drag & Drop Upload Input */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition">
              <Upload className="h-8 w-8 text-emerald-600 mb-2" />
              <span className="text-xs font-bold text-slate-700">Click or drag image to upload</span>
              <span className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 10MB</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Image Preview Box */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-60">
              <img src={previewUrl} alt="Waste Preview" className="h-full w-full object-cover" />
              {analyzing && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2">
                  <RefreshCw className="h-8 w-8 animate-spin text-emerald-400" />
                  <span className="text-xs font-bold">Extracting Visual Features...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">API Endpoint: POST /api/analyze-waste</span>
                <h3 className="text-lg font-extrabold text-slate-900">Computer Vision Analysis Results</h3>
              </div>
              {analysis && (
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                  analysis.overflow_status === 'Overflow Risk' ? 'bg-red-100 text-red-700' :
                  analysis.overflow_status === 'Nearly Full' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {analysis.overflow_status}
                </span>
              )}
            </div>

            {analysis ? (
              <div className="space-y-6">
                {/* Condition Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-[11px] text-slate-500 block font-medium">Estimated Volume</span>
                    <span className="text-xl font-extrabold text-slate-900">{analysis.estimated_volume_pct}% Full</span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-[11px] text-slate-500 block font-medium">Model Confidence</span>
                    <span className="text-xl font-extrabold text-emerald-600">{analysis.confidence_score}%</span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-[11px] text-slate-500 block font-medium">Assigned Priority</span>
                    <span className="text-xl font-extrabold text-red-600">{analysis.recommended_priority}</span>
                  </div>
                </div>

                {/* Detected Categories Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">Detected Waste Categories</h4>
                  <div className="space-y-2.5">
                    {analysis.categories.map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-800">
                          <span>{cat.category}</span>
                          <span>{cat.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation Box */}
                <div className="rounded-xl bg-emerald-50/70 p-4 border border-emerald-500/20 text-emerald-900 space-y-1">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-700">
                    <Sparkles className="h-4 w-4" /> AI Action Recommendation:
                  </span>
                  <p className="text-xs leading-relaxed font-medium">{analysis.recommendation}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">Run an analysis to inspect detected waste breakdown</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
