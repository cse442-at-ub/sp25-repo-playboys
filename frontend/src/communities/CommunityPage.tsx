import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CommunityPage.css";
import Sidebar from "../user_profile/Sidebar";
import { useCSRFToken } from "../csrfContent";

interface Community {
  name: string;
  background_image: string;
  creator_id: number;
  creator_username: string;
}

const CommunityPage: React.FC = () => {
  return (
  )

}


export default CommunityPage;
