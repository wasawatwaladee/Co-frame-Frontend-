import { useState } from "react";
import MainLayout from "../layouts/Layout";
import SidebarTrending from "../components/SidebarTrending";
import PostContainer from "../components/PostContainer";
import SidebarCommunity from "../components/SidebarSteam";

function communityPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    console.log(`Category ID clicked: ${id}`);
  };

  return (
    <MainLayout>
      <SidebarCommunity
        onSelect={handleCategoryClick}
        activeId={selectedCategoryId}
      />

      <div className="ml-64 pt-4">
        <PostContainer categoryId={selectedCategoryId} />
      </div>

      <SidebarTrending selectedCategory="ALL" />
    </MainLayout>
  );
}

export default communityPage;
