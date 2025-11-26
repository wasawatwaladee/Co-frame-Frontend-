import { useState } from 'react'
import MainLayout from '../layouts/Layout'
import SidebarTrending from '../components/SidebarTrending'
import SidebarSteam from '../components/SidebarSteam'
import PostContainer from '../components/PostContainer'

function communityPage() {
  const [selectedCategory, setSelectedCategory] = useState('HORROR');

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log(`Category clicked: ${category}`);
  };

  return (
    <>
      {/* <MainLayout /> */}

      <SidebarSteam
        onCategorySelect={handleCategoryClick}
        activeCategory={selectedCategory}
      />
      <PostContainer />
      <SidebarTrending
        selectedCategory={selectedCategory}
      />
    </>
  )
}

export default communityPage