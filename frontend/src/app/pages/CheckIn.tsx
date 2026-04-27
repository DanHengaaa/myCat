import { useState, useRef } from "react";
import { Camera, MapPin, UploadCloud, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { mockCats } from "../../data/mock";

export default function CheckIn() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [catMatch, setCatMatch] = useState<any>(null);
  const [location, setLocation] = useState("正在获取位置...");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
      simulateAI();
    }
  };

  const simulateAI = () => {
    setIsRecognizing(true);
    setLocation("校园图书馆东侧 (Library East)");
    setTimeout(() => {
      setIsRecognizing(false);
      setCatMatch(mockCats[0]);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return alert("请先上传照片 (Please upload a photo)");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-stone-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </motion.div>
        <h2 className="text-3xl font-bold text-stone-800 mb-3">上报成功! (Submitted)</h2>
        <p className="text-stone-500 mb-8 text-lg">管理员正在审核，感谢你的记录~</p>
        <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-orange-500 text-white rounded-xl shadow-md font-medium hover:bg-orange-600 transition-colors text-lg">
          继续打卡
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-stone-50 p-6 md:p-10 flex flex-col items-center justify-start">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-stone-100 bg-orange-50/50">
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-3">
            <Camera className="w-6 h-6 text-orange-500" />
            发现猫咪 (Check-in)
          </h1>
          <p className="text-sm text-stone-500 mt-2">上传照片，AI将自动识别猫咪身份并记录点位信息</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          
          {/* Left: Photo Upload */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full aspect-[4/3] bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-stone-100 transition-colors group"
            >
              {photo ? (
                <img src={photo} alt="Uploaded" className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-stone-400 mb-4 group-hover:text-orange-500 transition-colors" />
                  <p className="text-sm font-medium text-stone-600">点击拍照或上传图片</p>
                  <p className="text-xs text-stone-400 mt-1">支持 JPG, PNG (Max 5MB)</p>
                </>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              
              <AnimatePresence>
                {isRecognizing && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                  >
                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-orange-400" />
                    <p className="text-sm font-medium">正在 AI 识别猫咪...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Form Details */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            {/* Location */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-stone-500 font-medium">GPS 当前位置</p>
                <p className="text-sm font-semibold text-stone-800 truncate">{location}</p>
              </div>
              {photo && !isRecognizing && <span className="text-xs text-green-600 font-semibold bg-green-100 px-2.5 py-1 rounded-md shrink-0">已定位</span>}
            </div>

            {/* AI Match Result */}
            {catMatch && (
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                <img src={catMatch.imageUrl} alt={catMatch.name} className="w-14 h-14 rounded-lg object-cover shadow-sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full shadow-sm">AI 识别成功</span>
                    <p className="text-base font-bold text-orange-900">{catMatch.name}</p>
                  </div>
                  <p className="text-xs text-orange-700 mt-1">{catMatch.color} · 相似度 98%</p>
                </div>
                <button type="button" onClick={() => setCatMatch(null)} className="text-xs text-stone-500 hover:text-stone-800 underline mt-1 shrink-0">重新匹配</button>
              </motion.div>
            )}

            {/* Comment Area */}
            <div className="flex-1 flex flex-col min-h-[140px]">
              <label className="text-sm font-medium text-stone-700 mb-2 block">发现备注 (Notes)</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full flex-1 bg-white border border-stone-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-200 outline-none resize-none placeholder:text-stone-400 shadow-sm"
                placeholder="发现它在做什么？是否有受伤或异常情况？"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={!photo || isRecognizing}
              className="w-full py-4 mt-2 rounded-xl bg-orange-500 text-white font-bold text-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交打卡 (Submit)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
