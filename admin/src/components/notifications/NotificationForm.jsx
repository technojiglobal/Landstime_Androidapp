// //admin/src/components/notifications/NotificationForm.jsx

// import React, { useState } from "react";
// import { Users, ChevronDown, Calendar, Clock, Send } from "lucide-react";

// const NotificationForm = () => {
//   const [title, setTitle] = useState("");
//   const [message, setMessage] = useState("");
//   const [audience, setAudience] = useState("all");
//   const [sendType, setSendType] = useState("now");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({ title, message, audience, sendType, date, time });
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto">
//       {/* HEADER */}


//       {/* FORM CARD */}
//       <div
//         className="
//           bg-white 
//           rounded-xl 
//           border border-[#0000001A] 
//           shadow-sm 
//           p-4 sm:p-5 lg:p-6
//         "
//       >
//         <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
//           Create New Notification
//         </h2>

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4 sm:space-y-5"
//         >
//           {/* TITLE */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Notification Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter title name"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               className="
//                 w-full 
//                 rounded-lg 
//                 border border-[#0000001A] 
//                 px-3 sm:px-4 
//                 py-2 
//                 text-sm 
//                 outline-none 
//                 focus:ring-2 focus:ring-blue-500
//               "
//             />
//           </div>

//           {/* MESSAGE */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Message <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               rows={4}
//               placeholder="Enter notification message"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               required
//               className="
//                 w-full 
//                 rounded-lg 
//                 border border-[#0000001A] 
//                 px-3 sm:px-4 
//                 py-2 
//                 text-sm 
//                 outline-none 
//                 resize-none 
//                 focus:ring-2 focus:ring-blue-500
//               "
//             />
//           </div>

//           {/* TARGET AUDIENCE */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Target Audience <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//               <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
//               <select
//                 value={audience}
//                 onChange={(e) => setAudience(e.target.value)}
//                 className="
//                   w-full 
//                   appearance-none 
//                   rounded-lg 
//                   border border-[#0000001A] 
//                   cursor-pointer 
//                   pl-10 pr-10 
//                   py-2 
//                   text-sm 
//                   outline-none 
//                   focus:ring-2 focus:ring-blue-500
//                 "
//               >
//                 <option value="all">All Users</option>
//                 <option value="active">Active Users</option>
//                 <option value="inactive">Inactive Users</option>
//               </select>
//             </div>
//           </div>

//           {/* SEND TO */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Send To
//             </label>
//             <div className="relative">
//               <Send className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//               <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
//               <select
//                 value={sendType}
//                 onChange={(e) => setSendType(e.target.value)}
//                 className="
//                   w-full 
//                   appearance-none 
//                   rounded-lg 
//                   border border-[#0000001A] 
//                   cursor-pointer 
//                   pl-10 pr-10 
//                   py-2 
//                   text-sm 
//                   outline-none 
//                   focus:ring-2 focus:ring-blue-500
//                 "
//               >
//                 <option value="now">Send Now</option>
//                 <option value="schedule">Schedule</option>
//               </select>
//             </div>
//           </div>

//           {/* SCHEDULE */}
//           {sendType === "schedule" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Date
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="
//                       w-full 
//                       rounded-lg 
//                       border border-[#0000001A] 
//                       pl-10 pr-4 
//                       py-2 
//                       text-sm 
//                       outline-none 
//                       focus:ring-2 focus:ring-blue-500
//                     "
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Time
//                 </label>
//                 <div className="relative">
//                   <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                   <input
//                     type="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     className="
//                       w-full 
//                       rounded-lg 
//                       border border-[#0000001A] 
//                       pl-10 pr-4 
//                       py-2 
//                       text-sm 
//                       outline-none 
//                       focus:ring-2 focus:ring-blue-500
//                     "
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* SUBMIT */}
//           <button
//             type="submit"
//             className="
//               w-full 
//               flex items-center justify-center 
//               gap-2 
//               bg-blue-600 hover:bg-blue-700 
//               text-white 
//               py-2.5 
//               rounded-lg 
//               font-medium 
//               transition
//             "
//           >
//             <Send className="w-4 h-4" />
//             {sendType === "schedule"
//               ? "Schedule Notification"
//               : "Send Notification"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NotificationForm;


import React, { useState } from "react";
import { Users, ChevronDown, Calendar, Clock, Send } from "lucide-react";

const NotificationForm = ({ notification, setNotification }) => {
  const [audience, setAudience] = useState("all");
  const [sendType, setSendType] = useState("now");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ 
      title: notification.title, 
      message: notification.message, 
      audience, 
      sendType, 
      date, 
      time 
    });
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 md:p-6 lg:p-7 h-full">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 sm:mb-5 lg:mb-6 text-gray-900">
          Create New Notification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Notification Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter title name"
              value={notification.title}
              onChange={(e) => setNotification({...notification, title: e.target.value})}
              required
              className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Enter notification message"
              value={notification.message}
              onChange={(e) => setNotification({...notification, message: e.target.value})}
              required
              className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
            />
          </div>

          {/* TARGET AUDIENCE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
              <ChevronDown className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 cursor-pointer pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 bg-white"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </div>
          </div>

          {/* SEND TO */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Send To
            </label>
            <div className="relative">
              <Send className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
              <ChevronDown className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
              <select
                value={sendType}
                onChange={(e) => setSendType(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 cursor-pointer pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 bg-white"
              >
                <option value="now">Send Now</option>
                <option value="schedule">Schedule</option>
              </select>
            </div>
          </div>

          {/* SCHEDULE */}
          {sendType === "schedule" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400 pointer-events-none z-10" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 sm:gap-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 sm:py-3 lg:py-3.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md mt-6 sm:mt-7 lg:mt-8"
          >
            <Send className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            {sendType === "schedule" ? "Schedule Notification" : "Send Notification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm