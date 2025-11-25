import React from 'react'
import MainLayout from '../layouts/Layout'
import SidebarTrending from '../components/SidebarTrending'
import SidebarSteam from '../components/SidebarSteam'
import PostContainer from '../components/PostContainer'

function communityPage() {
  return (
    <>
     <MainLayout />
     
     <SidebarSteam />
     <PostContainer />
     <SidebarTrending />
    </>
  )
}

export default communityPage