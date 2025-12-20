import React, { useState } from "react";
import { Users, ChevronDown, Calendar, Clock, Send } from "lucide-react";

const NotificationForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [sendType, setSendType] = useState("now");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, message, audience, sendType, date, time });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* HEADER */}


      {/* FORM CARD */}
      <div
        className="
          bg-white 
          rounded-xl 
          border border-[#0000001A] 
          shadow-sm 
          p-4 sm:p-5 lg:p-6
        "
      >
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
          Create New Notification
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5"
        >
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Notification Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter title name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="
                w-full 
                rounded-lg 
                border border-[#0000001A] 
                px-3 sm:px-4 
                py-2 
                text-sm 
                outline-none 
                focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="
                w-full 
                rounded-lg 
                border border-[#0000001A] 
                px-3 sm:px-4 
                py-2 
                text-sm 
                outline-none 
                resize-none 
                focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          {/* TARGET AUDIENCE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="
                  w-full 
                  appearance-none 
                  rounded-lg 
                  border border-[#0000001A] 
                  cursor-pointer 
                  pl-10 pr-10 
                  py-2 
                  text-sm 
                  outline-none 
                  focus:ring-2 focus:ring-blue-500
                "
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </div>
          </div>

          {/* SEND TO */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Send To
            </label>
            <div className="relative">
              <Send className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={sendType}
                onChange={(e) => setSendType(e.target.value)}
                className="
                  w-full 
                  appearance-none 
                  rounded-lg 
                  border border-[#0000001A] 
                  cursor-pointer 
                  pl-10 pr-10 
                  py-2 
                  text-sm 
                  outline-none 
                  focus:ring-2 focus:ring-blue-500
                "
              >
                <option value="now">Send Now</option>
                <option value="schedule">Schedule</option>
              </select>
            </div>
          </div>

          {/* SCHEDULE */}
          {sendType === "schedule" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="
                      w-full 
                      rounded-lg 
                      border border-[#0000001A] 
                      pl-10 pr-4 
                      py-2 
                      text-sm 
                      outline-none 
                      focus:ring-2 focus:ring-blue-500
                    "
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="
                      w-full 
                      rounded-lg 
                      border border-[#0000001A] 
                      pl-10 pr-4 
                      py-2 
                      text-sm 
                      outline-none 
                      focus:ring-2 focus:ring-blue-500
                    "
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="
              w-full 
              flex items-center justify-center 
              gap-2 
              bg-blue-600 hover:bg-blue-700 
              text-white 
              py-2.5 
              rounded-lg 
              font-medium 
              transition
            "
          >
            <Send className="w-4 h-4" />
            {sendType === "schedule"
              ? "Schedule Notification"
              : "Send Notification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm;
