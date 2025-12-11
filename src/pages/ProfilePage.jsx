import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/Layout";
import useUserStore from "../stores/Store";
import { useEffect } from "react";
import axios from "axios";
import { siteConfig } from "../constant/config";

export default function ProfilePage() {
  const isDarkMode = useUserStore((state) => state.isDarkMode);
  const token = useUserStore((state) => state.token);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const {username} = useParams()
  const setUser = useUserStore((state) => state.setUser);
  // ใช้เฉพาะเวลาที่ owner แก้ไขโปรไฟล์
  const [isEditing, setIsEditing] = useState(false); 

  // State สำหรับข้อมูลโปรไฟล์
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    favoriteGenre: "",
    joinDate: "",
    username: "",
  });

  useEffect(()=>{
    const loadProfile = async ()=> {
      try {
        let res
        if(username){
          res = await axios.get(
            `${siteConfig.SERVER_URL}/api/auth/me/${username.toLowerCase()}`
          );
          setProfileData(res.data.user)
          // ใส่ค่าใน form แต่ไม่ให้ edit
          setFormData({
            firstName: res.data.user.firstName || "",
            lastName: res.data.user.lastName || "",
            email: res.data.user.email || "",
            bio: res.data.user.bio || "",
            favoriteGenre: res.data.user.favoriteGenre || "",
            joinDate: res.data.user.createdAt
              ? new Date(res.data.user.createdAt).toLocaleDateString()
              : "Unknown",
            username: res.data.user.username || "",
          });
          setLoading(false);
          return;
        }
        if (token) {
          res = await axios.get(`${siteConfig.SERVER_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(res.data.user);
          setProfileData(res.data.user);

          setFormData({
            firstName: res.data.user.firstName || "",
            lastName: res.data.user.lastName || "",
            email: res.data.user.email || "",
            bio: res.data.user.bio || "",
            favoriteGenre: res.data.user.favoriteGenre || "",
            joinDate: res.data.user.createdAt
              ? new Date(res.data.user.createdAt).toLocaleDateString()
              : "Unknown",
            username: res.data.user.username || "",
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setLoading(false);
      }
    }
    loadProfile()
  },[username, token, setUser])

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       if (!token) return;

  //       const res = await axios.get("http://localhost:5500/api/auth/me", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       console.log("FetchUser", res.data.user);
  //       //update zustand
  //       useUserStore.setState({ user: res.data.user });
  //       // update form
  //       setFormData((prev) => ({
  //         ...prev,
  //         username: res.data.user.username,
  //         firstName: `${res.data.user.firstName} `,
  //         lastName: `${res.data.user.lastName}`,
  //         email: res.data.user.email,
  //         bio: res.data.user.bio,
  //         favoriteGenre: res.data.user.favoriteGenre ?? "",
  //         joinDate: res.data.user.createdAt
  //           ? new Date(res.data.user.createdAt).toLocaleDateString()
  //           : "Unknown",
  //       }));
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchProfile();
  // }, []);

  const handleEditProfile = async () => {
    try {
      const res = await axios.put(
        `${siteConfig.SERVER_URL}/api/auth/me`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          favoriteGenre: formData.favoriteGenre || "Action",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data.user);
      setProfileData(res.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };
  // const handleEditProfile = async () => {
  //   console.log("✅ handleEditProfile CLICKED");
  //   try {
  //     const token = useUserStore.getState().token;

  //     const res = await axios.put(
  //       "http://localhost:5500/api/auth/me",
  //       {
  //         firstName: formData.firstName,
  //         lastName: formData.lastName,
  //         username: formData.username,
  //         email: formData.email,
  //         bio: formData.bio ?? "",
  //         favoriteGenre: formData.favoriteGenre,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     // update store
  //     useUserStore.setState({ user: res.data.user });

  //     setIsEditing(false);
  //   } catch (error) {
  //     console.error("Failed to update profile", error);
  //   }
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  if (loading) return <div>Loading...</div>;
  if (!profileData)
    return <div className="text-red-500 text-center">User not found</div>;

  const isOwner = !username; // ถ้าไม่มี username param → คือ owner

  return (
    <MainLayout>
      <main
        className={`flex w-full flex-1 justify-center px-4 py-8 sm:px-8 ${
          isDarkMode ? "bg-black" : "bg-white"
        }`}
      >
        <div className="flex w-full max-w-7xl flex-col gap-8 lg:flex-row">
          {/* Main Column */}
          <div className="flex w-full flex-col gap-8 lg:w-2/3">
            {/* Profile Header */}
            <section
              className={`rounded-xl p-6 ${
                isDarkMode ? "bg-zinc-900" : "bg-gray-50"
              }`}
            >
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <div
                    className={`h-24 w-24 min-w-24 rounded-full ring-2 ring-primary flex items-center justify-center sm:h-32 sm:w-32 ${
                      isDarkMode ? "bg-zinc-800" : "bg-gray-200"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-12 h-12 sm:w-16 sm:h-16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>

                  {/* User Info */}
                  <div className="flex flex-col justify-center gap-1">
                    <h1
                      className={`text-2xl font-bold sm:text-3xl ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {profileData.firstName}
                      {" "}
                      {profileData.lastName}
                    </h1>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      {profileData.username}
                    </p>
                    <p
                      className={`mt-1 hidden text-sm sm:block ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      {profileData.bio}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-zinc-500" : "text-gray-500"
                      }`}
                    >
                      Joined {profileData.joinDate}
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                {isOwner && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex h-10 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-sm font-bold transition-opacity sm:w-auto ${
                    isDarkMode
                      ? isEditing
                        ? "bg-zinc-700 text-white hover:bg-zinc-800"
                        : "bg-zinc-700 text-white hover:bg-zinc-800"
                      : isEditing
                      ? "bg-gray-100 text-black hover:bg-gray-200"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  <span className="truncate">
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </span>
                </button>
                )}
              </div>
            </section>

            {/* Stats */}
            {!isEditing && (
              <section>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div
                    className={`flex flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 ${
                      isDarkMode ? "bg-zinc-900" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      Movies Watched
                    </p>
                    <p
                      className={`text-3xl font-bold tracking-tight ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      256
                    </p>
                  </div>
                  <div
                    className={`flex flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 ${
                      isDarkMode ? "bg-zinc-900" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      Reviews Written
                    </p>
                    <p
                      className={`text-3xl font-bold tracking-tight ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      88
                    </p>
                  </div>
                  <div
                    className={`flex flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 ${
                      isDarkMode ? "bg-zinc-900" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      Followers
                    </p>
                    <p
                      className={`text-3xl font-bold tracking-tight ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      1.2k
                    </p>
                  </div>
                  <div
                    className={`flex flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 ${
                      isDarkMode ? "bg-zinc-900" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      Following
                    </p>
                    <p
                      className={`text-3xl font-bold tracking-tight ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      150
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Edit Form */}
            { isOwner && isEditing && (
              <section
                className={`rounded-xl p-6 ${
                  isDarkMode ? "bg-zinc-900" : "bg-gray-50"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Edit Profile
                </h2>
                <div className="space-y-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-3 ${
                        isDarkMode ? "text-zinc-300" : "text-gray-700"
                      }`}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                        isDarkMode
                          ? "bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
                          : "bg-white text-black border-gray-300 placeholder:text-gray-400"
                      }`}
                    />
                    <label
                      className={`block text-sm font-medium mb-3 ${
                        isDarkMode ? "text-zinc-300" : "text-gray-700"
                      }`}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                        isDarkMode
                          ? "bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
                          : "bg-white text-black border-gray-300 placeholder:text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-3 ${
                        isDarkMode ? "text-zinc-300" : "text-gray-700"
                      }`}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                        isDarkMode
                          ? "bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
                          : "bg-white text-black border-gray-300 placeholder:text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-3 ${
                        isDarkMode ? "text-zinc-300" : "text-gray-700"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                        isDarkMode
                          ? "bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
                          : "bg-white text-black border-gray-300 placeholder:text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-3 ${
                        isDarkMode ? "text-zinc-300" : "text-gray-700"
                      }`}
                    >
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                        isDarkMode
                          ? "bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
                          : "bg-white text-black border-gray-300 placeholder:text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-3 ${
                        isDarkMode ? "text-zinc-300" : "text-gray-700"
                      }`}
                    >
                      Favorite Genre
                    </label>
                    <select
                      name="favoriteGenre"
                      value={formData.favoriteGenre || "Action"}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                        isDarkMode
                          ? "bg-zinc-800 text-white border-zinc-700"
                          : "bg-white text-black border-gray-300"
                      }`}
                    >
                      <option value="Action">Action</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Drama">Drama</option>
                      <option value="Horror">Horror</option>
                      <option value="SciFi">Sci-Fi</option>
                      <option value="Romance">Romance</option>
                      <option value="Thriller">Thriller</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleEditProfile}
                      className="flex-1 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Profile Information */}
            {!isEditing && (
              <section
                className={`rounded-xl p-6 ${
                  isDarkMode ? "bg-zinc-900" : "bg-gray-50"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  About
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      Full Name
                    </p>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {profileData.firstName}
                      {profileData.lastName}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      Email
                    </p>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {profileData.email}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      Bio
                    </p>
                    <p
                      className={`text-lg leading-relaxed ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {profileData.bio}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                    >
                      Favorite Genre
                    </p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        isDarkMode
                          ? "bg-primary/20 text-primary"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {profileData.favoriteGenre}
                    </span>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="flex w-full flex-col gap-8 lg:w-1/3">
            {/* Quick Actions */}
            <div
              className={`rounded-xl p-6 ${
                isDarkMode ? "bg-zinc-900" : "bg-gray-50"
              }`}
            >
              <h3
                className={`mb-4 text-base font-bold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Quick Actions
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-medium transition-all ${
                    isDarkMode
                      ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-black"
                  }`}
                >
                  View Activity
                </button>
                <button
                  className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-medium transition-all ${
                    isDarkMode
                      ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-black"
                  }`}
                >
                  Watchlist
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-bold transition-all ${
                    isDarkMode
                      ? "bg-red-900 hover:bg-red-800 text-white"
                      : "bg-red-100 hover:bg-red-200 text-red-900"
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Favorite Movies */}
            <div
              className={`rounded-xl p-6 ${
                isDarkMode ? "bg-zinc-900" : "bg-gray-50"
              }`}
            >
              <h3
                className={`mb-4 text-base font-bold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Favorite Movies
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`aspect-[2/3] w-full rounded-lg ${
                      isDarkMode ? "bg-zinc-800" : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Followers */}
            <div
              className={`rounded-xl p-6 ${
                isDarkMode ? "bg-zinc-900" : "bg-gray-50"
              }`}
            >
              <h3
                className={`mb-4 text-base font-bold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Following
              </h3>
              <div className="flex flex-col gap-4">
                {["Jane Smith", "MovieBuff22", "CinemaQueen"].map((name, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-full flex items-center justify-center ${
                          isDarkMode ? "bg-zinc-800" : "bg-gray-300"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {name}
                        </p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-zinc-400" : "text-gray-600"
                          }`}
                        >
                          @{name.toLowerCase().replace(" ", "_")}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`flex h-8 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-medium transition-colors ${
                        isDarkMode
                          ? "border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                          : "border border-gray-300 bg-white text-black hover:bg-gray-100"
                      }`}
                    >
                      Following
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </MainLayout>
  );
}
