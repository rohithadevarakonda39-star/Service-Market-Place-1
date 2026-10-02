import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, X, AlertCircle, FileCheck, Eye } from 'lucide-react';

export const MediaUploadZone = ({ files = [], onFilesChange, maxFiles = 6, maxSizeBytes = 15 * 1024 * 1024 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activePreview, setActivePreview] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndProcessFiles = (incomingFiles) => {
    setErrorMsg('');
    const validArray = Array.from(incomingFiles);

    if (files.length + validArray.length > maxFiles) {
      setErrorMsg(`You can upload a maximum of ${maxFiles} files (images or short videos).`);
      return;
    }

    const processed = [];
    for (const file of validArray) {
      // Format validation
      const isImg = file.type.startsWith('image/');
      const isVid = file.type.startsWith('video/');

      if (!isImg && !isVid) {
        setErrorMsg(`"${file.name}" is not a supported media format. Please upload JPG, PNG, WEBP, or MP4.`);
        continue;
      }

      // Size validation
      if (file.size > maxSizeBytes) {
        setErrorMsg(`"${file.name}" exceeds the 15MB size limit.`);
        continue;
      }

      // Generate preview object
      const previewUrl = URL.createObjectURL(file);
      processed.push({
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        sizeMb: (file.size / (1024 * 1024)).toFixed(2),
        type: isVid ? 'video' : 'image',
        url: previewUrl,
        rawFile: file
      });
    }

    if (processed.length > 0) {
      onFilesChange([...files, ...processed]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  const handleNativeSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (idToRemove) => {
    const nextFiles = files.filter(f => f.id !== idToRemove);
    onFilesChange(nextFiles);
    if (activePreview?.id === idToRemove) {
      setActivePreview(null);
    }
  };

  return (
    <div className="media-upload-root">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={handleNativeSelect}
      />

      {/* Drag & Drop Zone */}
      <div
        className={`media-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="dropzone-icon-circle">
          <UploadCloud size={28} color="#10b981" />
        </div>
        <div className="dropzone-text">
          <p className="dropzone-primary-text">
            <strong>Click to upload</strong> or drag and drop photos/videos
          </p>
          <span className="dropzone-sub-text">
            PNG, JPG, WEBP, or MP4 (Max {maxFiles} files, up to 15MB each)
          </span>
        </div>
        <div className="dropzone-tags-row">
          <span className="format-tag"><ImageIcon size={12} /> Images</span>
          <span className="format-tag"><Video size={12} /> Short Video</span>
        </div>
      </div>

      {/* Error notification if validation fails */}
      {errorMsg && (
        <div className="media-error-badge">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploaded Thumbnails Preview Grid */}
      {files.length > 0 && (
        <div className="media-preview-section">
          <div className="media-preview-header">
            <span className="preview-count-label">
              <FileCheck size={14} color="#10b981" /> Attached Proof ({files.length}/{maxFiles})
            </span>
            <span className="preview-hint">Specialists can inspect damage before travel</span>
          </div>

          <div className="media-preview-grid">
            {files.map((item) => (
              <div key={item.id} className="media-thumbnail-card">
                {item.type === 'video' ? (
                  <div className="video-thumb-wrapper" onClick={() => setActivePreview(item)}>
                    <video src={item.url} className="thumb-media" muted preload="metadata" />
                    <div className="video-overlay-badge">
                      <Video size={13} color="#ffffff" />
                      <span>Video</span>
                    </div>
                  </div>
                ) : (
                  <div className="img-thumb-wrapper" onClick={() => setActivePreview(item)}>
                    <img src={item.url} alt={item.name} className="thumb-media" />
                    <div className="zoom-hover-overlay">
                      <Eye size={16} color="#ffffff" />
                    </div>
                  </div>
                )}

                {/* File info footer */}
                <div className="thumb-footer">
                  <span className="thumb-name" title={item.name}>{item.name}</span>
                  <span className="thumb-size">{item.sizeMb} MB</span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  className="thumb-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  title="Remove file"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Zoom Preview */}
      {activePreview && (
        <div className="media-lightbox-overlay" onClick={() => setActivePreview(null)}>
          <div className="media-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-top">
              <span className="lightbox-title">{activePreview.name} ({activePreview.sizeMb} MB)</span>
              <button className="nav-icon-btn" onClick={() => setActivePreview(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="lightbox-body">
              {activePreview.type === 'video' ? (
                <video src={activePreview.url} controls autoPlay className="lightbox-media" />
              ) : (
                <img src={activePreview.url} alt={activePreview.name} className="lightbox-media" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styling */}
      <style>{`
        .media-upload-root {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .media-dropzone {
          border: 2px dashed rgba(16, 185, 129, 0.35);
          background: var(--bg-surface);
          border-radius: var(--radius-lg);
          padding: 2rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .media-dropzone:hover,
        .media-dropzone.dragging {
          border-color: var(--accent-primary);
          background: rgba(16, 185, 129, 0.06);
          transform: translateY(-2px);
        }

        .dropzone-icon-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dropzone-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dropzone-primary-text {
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .dropzone-primary-text strong {
          color: var(--accent-primary);
        }

        .dropzone-sub-text {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .dropzone-tags-row {
          display: flex;
          gap: 0.5rem;
        }

        .format-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.6rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        .media-error-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.9rem;
          border-radius: var(--radius-md);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          font-size: 0.82rem;
        }

        .media-preview-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .media-preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .preview-count-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .preview-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .media-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.75rem;
        }

        .media-thumbnail-card {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-fast);
        }
        .media-thumbnail-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-primary);
        }

        .img-thumb-wrapper,
        .video-thumb-wrapper {
          position: relative;
          width: 100%;
          height: 95px;
          cursor: pointer;
          background: #000000;
          overflow: hidden;
        }

        .thumb-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .zoom-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .img-thumb-wrapper:hover .zoom-hover-overlay {
          opacity: 1;
        }

        .video-overlay-badge {
          position: absolute;
          bottom: 6px;
          left: 6px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          padding: 0.2rem 0.45rem;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.68rem;
          color: #ffffff;
        }

        .thumb-footer {
          padding: 0.45rem 0.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .thumb-name {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .thumb-size {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .thumb-remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          z-index: 2;
        }
        .thumb-remove-btn:hover {
          background: #ef4444;
          border-color: #ef4444;
        }

        .media-lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .media-lightbox-content {
          max-width: 800px;
          max-height: 85vh;
          width: 100%;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .lightbox-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
        }

        .lightbox-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lightbox-body {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000;
          max-height: 70vh;
        }

        .lightbox-media {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};
