import MainLayout from "../layouts/Layout";
import WatchPartyHeader from "../components/watch-party/WatchPartyHeader";
import VideoControls from "../components/watch-party/VideoControls";
import ChatSidebar from "../components/watch-party/ChatSidebar";

export const mockMessages = [
  {
    id: 1,
    user: "มาร์ค",
    avatarColor: "bg-primary",
    time: "13:59",
    text: "เพิ่งมาทันเลย 😅",
  },
  {
    id: 2,
    user: "แอน",
    avatarColor: "bg-ratingGold",
    time: "14:00",
    text: "ฉากนี้เจ๋งมาก!",
  },
  {
    id: 3,
    user: "บอล",
    avatarColor: "bg-blue-500",
    time: "14:01",
    text: "มีใครทานป๊อปคอร์นบ้าง 🍿",
  },
  {
    id: 4,
    user: "ใหม่",
    avatarColor: "bg-green-500",
    time: "14:02",
    text: "หนังดีจัง",
  },
  {
    id: 5,
    user: "แอน",
    avatarColor: "bg-ratingGold",
    time: "14:03",
    text: "ฉากนี้เจ๋งมาก!",
  },
  {
    id: 6,
    user: "มาร์ค",
    avatarColor: "bg-primary",
    time: "14:03",
    text: "เพิ่งมาทันเลย 😅",
  },
];

const WatchPartyPage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)]">
        {/* Left Column: Video Player Area */}
        <div className="flex-1 flex flex-col relative group rounded-lg overflow-hidden border border-white/10 bg-black">
          {/* Header */}
          <WatchPartyHeader />

          {/* Video Placeholder (แทนที่ด้วย Video Player จริงๆ ในอนาคต) */}
          {/* ผมใช้ gradient ดำ-แดง แทนสีม่วง เพื่อให้เข้าธีม */}
          <div className="flex-1 bg-linear-to-br from-bgMain via-bgSection to-primary/20 relative flex items-center justify-center">
            {/* Play Button (Placeholder Center) */}
            <button className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/90 text-white scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-primary/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10 pl-1"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Controls */}
          <VideoControls />
        </div>

        {/* Right Column: Chat Sidebar */}
        {/* ซ่อนในมือถือ แสดงในจอใหญ่ (lg ขึ้นไป) */}
        <div className="hidden lg:block w-[350px] shrink-0">
          <ChatSidebar />
        </div>
      </div>
    </MainLayout>
  );
};

export default WatchPartyPage;
