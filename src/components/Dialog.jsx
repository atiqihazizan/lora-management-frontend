import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes untuk validasi props
import Button from "./elements/Button";

const Dialog = ({
  isOpen = false,
  title = "",
  children = null,
  onClose = () => { },
  footerButtons = [],
  closeOnBackdropClick = false,
  onOk = null,
  width = "500px", // Default width
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Tutup dialog saat klik backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  // Tutup dialog saat tombol "Escape" ditekan
  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && isOpen && onClose();
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Fungsi untuk tombol "Save"
  const handleOk = async () => {
    if (!onOk) return;
    setIsLoading(true);
    try {
      const hasError = await onOk(); // onOk diharapkan mengembalikan boolean atau objek error
      if (hasError) return; // Jika ada error, keluar tanpa menutup dialog
    } finally {
      setIsLoading(false);
    }
    // onClose(); // Tutup dialog hanya jika tidak ada error
  };

  return (
    <div
      className={`card-dialog-layer ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"} `}
      onClick={handleBackdropClick}
    >
      <div
        className={`card-dialog-frame ${isOpen ? "scale-100" : "scale-90"}`}
        style={{ maxWidth: width }} // Custom width
      >
        {/* Header */}
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}

        {/* Content */}
        <div>{children}</div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
            <div className="text-white font-semibold">Loading...</div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end space-x-2 mt-6">
          {footerButtons.length > 0
            ? footerButtons.map((button, index) => (
              <Button
                key={index}
                label={button.label}
                onClick={button.onClick}
                variant={button.variant || "primary"}
                className={button.className || ""}
              />
            ))
            : (
              <>
                <Button label="Cancel" onClick={onClose} variant="secondary" />
                <Button label="Save" onClick={handleOk} variant="primary" disabled={isLoading} />
              </>
            )}
        </div>
      </div>
    </div>
  );
};

// PropTypes untuk validasi properti
Dialog.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Status dialog, harus ada
  title: PropTypes.string, // Judul dialog
  children: PropTypes.node, // Konten dalam dialog
  onClose: PropTypes.func.isRequired, // Fungsi untuk menutup dialog
  footerButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // Label tombol
      onClick: PropTypes.func.isRequired, // Fungsi saat tombol diklik
      variant: PropTypes.string, // Variasi tombol (opsional)
      className: PropTypes.string, // Kelas tambahan untuk tombol (opsional)
    })
  ), // Tombol khusus di footer
  closeOnBackdropClick: PropTypes.bool, // Apakah bisa ditutup dengan klik backdrop
  onOk: PropTypes.func, // Callback untuk tombol "Save"
  width: PropTypes.string, // Custom width
};

export default Dialog;
