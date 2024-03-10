import React, { useState } from "react";
import "./ShareModal.css";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";

export default function ShareModal({ setIsModalOpen, currentCategory }) {
  const [isCopied, setCopied] = useState(false);
  const link =
    process.env.NODE_ENV === "development"
      ? `http://localhost:5173/category/${currentCategory.toLowerCase()}`
      : `https://sysufe.vercel.app/category/${currentCategory.toLowerCase()}`;
  function handleCopyToClipboard() {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000); // Reset copied state after 1 seconds
        toast.info("Copied to clipboard.");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  }

  return (
    <>
      <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Share stories on {currentCategory}</h3>
          </div>
          <div className="modal-body">
            <p className="modal-text">{link}</p>
            <FiCopy className="copy-icon" onClick={handleCopyToClipboard} />
          </div>
          <div className="modal-footer">
            <button
              className="modal-close-button"
              onClick={() => setIsModalOpen(false)}
            >
              Close{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
