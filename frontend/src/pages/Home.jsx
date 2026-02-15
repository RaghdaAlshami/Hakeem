import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";



const Home = () => {
  return (
    <div className="relative">
      <Header />
      <SpecialityMenu />
      <TopDoctors />
     

    
    </div>
  );
};

export default Home;
