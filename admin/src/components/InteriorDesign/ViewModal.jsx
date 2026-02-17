// //admin/src/components/InteriorDesign/ViewModal.jsx

// import { X } from "lucide-react";

// export default function ViewModal({ item, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-[400px] relative">
//         <X className="absolute right-4 top-4 cursor-pointer" onClick={onClose} />
//         <pre className="text-sm">{JSON.stringify(item, null, 2)}</pre>
//       </div>
//     </div>
//   );
// }




// admin/src/components/InteriorDesign/ViewModal.jsx

import { X, Star, MapPin, Clock, DollarSign, User, Phone, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ViewModal({ item, onClose }) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!item) return null;

  const images = item.images || [];

  const prevImage = () => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const InfoRow = ({ icon: Icon, label, value, highlight }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-b-0">
      <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
        <Icon size={14} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 break-words ${highlight ? "text-blue-700" : "text-gray-800"}`}>
          {value || "—"}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
            <div className="min-w-0 flex-1 mr-3">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {item.name || "Design Details"}
              </h2>
              {item.category && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                  {item.category}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── BODY (scrollable) ── */}
          <div className="overflow-y-auto flex-1">
            <div className="flex flex-col lg:flex-row">

              {/* LEFT — IMAGE GALLERY */}
              <div className="lg:w-1/2 bg-gray-900 flex-shrink-0">
                {images.length > 0 ? (
                  <div className="relative">
                    {/* Main image */}
                    <div className="relative h-52 sm:h-64 md:h-72 lg:h-80">
                      <img
                        src={
                          typeof images[activeImage] === "string"
                            ? images[activeImage]
                            : images[activeImage]?.preview || images[activeImage]?.url
                        }
                        alt={`Design ${activeImage + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Expand button */}
                      <button
                        onClick={() => setLightbox(true)}
                        className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-colors"
                      >
                        <Maximize2 size={14} />
                      </button>

                      {/* Nav arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-colors"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-colors"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}

                      {/* Image counter */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/50 text-white text-xs rounded-full">
                        {activeImage + 1} / {images.length}
                      </div>
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="flex gap-2 p-3 overflow-x-auto bg-gray-900 scrollbar-hide">
                        {images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              i === activeImage
                                ? "border-blue-400 scale-105"
                                : "border-gray-600 opacity-60 hover:opacity-80"
                            }`}
                          >
                            <img
                              src={typeof img === "string" ? img : img?.preview || img?.url}
                              alt={`thumb-${i}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-52 sm:h-64 lg:h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">No images uploaded</p>
                    </div>
                  </div>
                )}

                {/* Rating badge (shown only on lg+ overlapping both panels) */}
                {item.rating !== undefined && (
                  <div className="hidden lg:flex items-center gap-2 px-4 py-3 bg-gray-800 border-t border-gray-700">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= Math.round(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                        />
                      ))}
                    </div>
                    <span className="text-white font-semibold text-sm">{item.rating}</span>
                    <span className="text-gray-400 text-xs">rating</span>
                  </div>
                )}
              </div>

              {/* RIGHT — DETAILS */}
              <div className="lg:w-1/2 p-4 sm:p-6">

                {/* Rating (mobile only) */}
                {item.rating !== undefined && (
                  <div className="flex items-center gap-2 mb-4 lg:hidden">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= Math.round(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-800">{item.rating}</span>
                    <span className="text-gray-400 text-xs">/ 5 rating</span>
                  </div>
                )}

                {/* Info rows */}
                <div className="space-y-0">
                  <InfoRow icon={User} label="Designer" value={item.designer} />
                  <InfoRow icon={Phone} label="Contact" value={item.phone} />
                  <InfoRow icon={DollarSign} label="Price Range" value={item.price?.includes("₹") ? item.price : `₹${item.price}`} highlight />
                  <InfoRow icon={MapPin} label="Location" value={item.location} />
                  <InfoRow icon={Clock} label="Duration" value={item.duration} />
                  <InfoRow
                    icon={() => (
                      <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    )}
                    label="Area"
                    value={item.area ? `${item.area} sq ft` : null}
                  />
                </div>

                {/* Description */}
                {item.description && (
                  <div className="mt-5">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Description</p>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div className="flex justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            onClick={() => setLightbox(false)}
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <img
            src={
              typeof images[activeImage] === "string"
                ? images[activeImage]
                : images[activeImage]?.preview || images[activeImage]?.url
            }
            alt="Full view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 text-white text-xs rounded-full">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}