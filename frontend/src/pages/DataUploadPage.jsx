import React, { useState, useEffect } from 'react'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Search
} from 'lucide-react'
import { authFetch, getAuthHeaders } from '../utils/api'
import '../styles/DashboardPage.css'

export default function DataUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [datasetName, setDatasetName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [datasetHistory, setDatasetHistory] = useState([])
  const [currentAnalysis, setCurrentAnalysis] = useState(null)

  const stepsList = [
    'Your data has been uploaded successfully.',
    'Validating file structure & record counts...',
    'We are looking for important patterns in your business...',
    'We are checking which areas are performing well...',
    'We are identifying areas that need attention...',
    'We are preparing recommendations based on your data.'
  ]

  const fetchHistory = () => {
    authFetch('http://localhost:5000/api/data/history')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.datasets) setDatasetHistory(data.datasets)
      })
      .catch(err => console.log('Fetch history fallback:', err))
  }

  const fetchCurrentAnalysis = () => {
    authFetch('http://localhost:5000/api/dashboard/summary')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.analysis) setCurrentAnalysis(data.analysis)
      })
      .catch(err => console.log('Fetch analysis fallback:', err))
  }

  useEffect(() => {
    fetchHistory()
    fetchCurrentAnalysis()
  }, [])

  const handleFileDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      if (!datasetName) setDatasetName(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      if (!datasetName) setDatasetName(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a .csv, .xlsx, or .xls file to upload.')
      return
    }

    setErrorMsg('')
    setIsUploading(true)
    setUploadStep(1)

    try {
      const formData = new FormData()
      formData.append('dataset', selectedFile)
      formData.append('name', datasetName || selectedFile.name)

      // Simulate realistic step updates
      const interval = setInterval(() => {
        setUploadStep(prev => (prev < 5 ? prev + 1 : prev))
      }, 400)

      const response = await fetch('http://localhost:5000/api/data/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      })

      clearInterval(interval)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Data upload and analysis failed.')
      }

      setUploadStep(6)
      setUploadStatus(data.message || 'Dataset successfully uploaded & analyzed!')
      setCurrentAnalysis(data.analysis)
      fetchHistory()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect to backend server.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteDataset = async (id) => {
    if (window.confirm('Are you sure you want to delete this dataset?')) {
      try {
        await authFetch(`http://localhost:5000/api/data/${id}`, { method: 'DELETE' })
        fetchHistory()
        fetchCurrentAnalysis()
      } catch (err) {
        console.log('Delete dataset error:', err)
      }
    }
  }

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      {/* Top Banner */}
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(37,99,235,0.3)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: 8 }}>
            <Upload size={12} /> Data Processing Engine
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Data Upload & Ingestion</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Connect your business datasets (.CSV, .XLSX, .XLS) for automated cleaning, profiling, and AI diagnostics.
          </p>
        </div>

        <div>
          <a
            href="http://localhost:5000/api/data/sample"
            download="sample_business_data.csv"
            className="btn-primary"
            style={{ fontSize: 13, padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--secondary)' }}
          >
            <Download size={15} /> Download Sample CSV
          </a>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px 16px', borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', fontSize: 14, marginBottom: 20, border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={18} /> {errorMsg}
        </div>
      )}

      {uploadStatus && (
        <div style={{ padding: '12px 16px', borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: 14, marginBottom: 20, border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> {uploadStatus}
        </div>
      )}

      {/* Main Upload Dropzone */}
      <div className="card" style={{ padding: 32, marginBottom: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Upload Business Dataset</h3>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          style={{
            border: '2px dashed var(--border)',
            borderRadius: 12,
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: 'rgba(37, 99, 235, 0.02)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: 20
          }}
          onClick={() => document.getElementById('file-upload-input').click()}
        >
          <input
            id="file-upload-input"
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <FileSpreadsheet size={28} />
          </div>

          <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
            {selectedFile ? selectedFile.name : 'Drag & Drop your CSV or Excel file here'}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Supports .CSV, .XLSX, .XLS files up to 25MB
          </p>
        </div>

        {selectedFile && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Dataset Display Name</label>
              <input
                className="input-field"
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="Name your dataset"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>File Size</label>
              <span className="badge badge-info" style={{ padding: '10px 14px', fontSize: 13 }}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        )}

        {isUploading && (
          <div style={{ marginBottom: 24, padding: 16, borderRadius: 8, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              <span>Pipeline Stage: {stepsList[uploadStep - 1] || 'Processing...'}</span>
              <span>{Math.round((uploadStep / 6) * 100)}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, backgroundColor: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(uploadStep / 6) * 100}%`, backgroundColor: 'var(--primary)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}

        <button
          className="btn-primary"
          onClick={handleStartAnalysis}
          disabled={isUploading || !selectedFile}
          style={{ width: '100%', padding: '14px', fontSize: 16, fontWeight: 600, opacity: isUploading || !selectedFile ? 0.6 : 1 }}
        >
          {isUploading ? 'Analyzing Dataset...' : <>Start Data Analysis Pipeline <ArrowRight size={18} /></>}
        </button>
      </div>

      {/* Dataset Preview & Quality Profile */}
      {currentAnalysis && currentAnalysis.summary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 28 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Active Dataset Summary</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Overview of records and data structure</p>
              </div>
              <span className="badge badge-info" style={{ background: '#10B98115', color: '#10B981' }}>
                Data Readiness: {currentAnalysis.summary.qualityScore}/100
              </span>
            </div>

            <div style={{ marginBottom: 20, padding: '14px 18px', borderRadius: 8, backgroundColor: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                YOUR DATA: We found {currentAnalysis.profile?.totalRows?.toLocaleString() || 0} records in your uploaded file.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-main)', margin: '4px 0 0', lineHeight: 1.4 }}>
                Your dataset contains information about sales performance, customer activity, and regional metrics.
              </p>
            </div>

            {/* Quality Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'rgba(37,99,235,0.03)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Records</span>
                <h4 style={{ fontSize: 18, fontWeight: 700, margin: '2px 0 0' }}>{currentAnalysis.profile?.totalRows || 0}</h4>
              </div>
              <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'rgba(37,99,235,0.03)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Detected Columns</span>
                <h4 style={{ fontSize: 18, fontWeight: 700, margin: '2px 0 0' }}>{currentAnalysis.profile?.totalCols || 0}</h4>
              </div>
              <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'rgba(37,99,235,0.03)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Empty Cells Handled</span>
                <h4 style={{ fontSize: 18, fontWeight: 700, margin: '2px 0 0' }}>{currentAnalysis.profile?.missingValuesCount || 0}</h4>
              </div>
              <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'rgba(37,99,235,0.03)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Duplicates Filtered</span>
                <h4 style={{ fontSize: 18, fontWeight: 700, margin: '2px 0 0' }}>{currentAnalysis.profile?.duplicateRowsCount || 0}</h4>
              </div>
            </div>

            {/* Clean Record Preview Table */}
            {currentAnalysis.previewRows && currentAnalysis.previewRows.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px' }}>Revenue ($)</th>
                      <th style={{ padding: '8px 12px' }}>Profit ($)</th>
                      <th style={{ padding: '8px 12px' }}>Quantity</th>
                      <th style={{ padding: '8px 12px' }}>Category</th>
                      <th style={{ padding: '8px 12px' }}>Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAnalysis.previewRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>${row.rev.toLocaleString()}</td>
                        <td style={{ padding: '8px 12px', color: '#10B981' }}>${row.profit.toLocaleString()}</td>
                        <td style={{ padding: '8px 12px' }}>{row.qty}</td>
                        <td style={{ padding: '8px 12px' }}>{row.cat || 'General'}</td>
                        <td style={{ padding: '8px 12px' }}>{row.reg || 'Global'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dataset History Table */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Uploaded Datasets History</h3>
        {datasetHistory.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No datasets uploaded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>Dataset Name</th>
                  <th style={{ padding: '10px 14px' }}>Original File</th>
                  <th style={{ padding: '10px 14px' }}>Records</th>
                  <th style={{ padding: '10px 14px' }}>Size</th>
                  <th style={{ padding: '10px 14px' }}>Upload Date</th>
                  <th style={{ padding: '10px 14px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {datasetHistory.map((d) => (
                  <tr key={d._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{d.name}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{d.originalName}</td>
                    <td style={{ padding: '10px 14px' }}>{d.recordCount}</td>
                    <td style={{ padding: '10px 14px' }}>{d.fileSize}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>
                      {new Date(d.uploadedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        onClick={() => handleDeleteDataset(d._id)}
                        style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', padding: 4 }}
                        title="Delete Dataset"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
