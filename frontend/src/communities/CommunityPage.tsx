import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./CommunityPage.css";
import Sidebar from "../user_profile/Sidebar";
import MainContent from "../MainContent";
import { useCSRFToken } from '../csrfContent';
import { get } from "jquery";
import { Verify } from "crypto";

interface Community {
  community_name: string;
  picture: string;
  members: string[];
  id: number;
  member_count: number;
  posts: Post[]
}

interface Post {
  username: string;
  title: string;
  song_name: string;
  post_id: number;
  media_path: string; // posts use old/bad way of storing imge paths prepend the .env url to this path
  description: string;
}

const CommunityPage: React.FC = () => {
  const location = useLocation();
  const { csrfToken } = useCSRFToken();
  const [communityData, setCommunityData] = useState<Community>();
  const [joined, setJoined] = useState<Boolean>(false)
  

  const getCommunityName = () => {
    // getting the name of the community from the URL
    const path = location.pathname;
    const segments = path.split("/");
    const encodedName = segments[segments.length - 1];
    const communityName = decodeURIComponent(encodedName);
    return communityName;
  };

  const getCommunityData = async (communityName: string) => {
    console.log("Fetching data for", communityName);
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getCommInfo.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ name: communityName }),
    });

    const data = await res.json();
    console.log("Raw response from getCommInfo:", data);
    return data
  };
  
  const create_comunity = (community_name: string, picture: string, members: string[], id: number, member_count: number, posts: Post[]): void => {
    setCommunityData({
      community_name: community_name,
      picture: picture,
      members: members,
      id: id,
      member_count: member_count,
      posts: posts
    });
  };

  const createPosts = (posts: Post[]) => {
      const postsList: Post[] = [];
      for (const post of posts) {
        console.log(post);
        const newPost: Post = {
          username: post.username,
          title: post.title,
          song_name: post.song_name,
          post_id: post.post_id,
          media_path: `${process.env.REACT_APP_API_URL}/${post.media_path}`, // posts use old/bad way of storing image paths prepend the .env url to this path
          description: post.description,
        };
        postsList.push(newPost);
      }
      return postsList
    };
  


  useEffect(() => {
    const communityName = getCommunityName();
    const fetchData = async () => {
      // code for creating the community
      const data = await getCommunityData(communityName);
      const posts = await createPosts(data.posts)
      await create_comunity(data.community_name, data.picture, data.members, data.id, data.members.length, posts);
    };
    fetchData();
  }, [location]);

  useEffect(() => {
    if (communityData) {
      updateUserStatus();
    }
  }, [communityData]);
  

  const verifyUserSession = async () => {
    const profileRes = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
    });
    const profileData = await profileRes.json();
    if (profileData.status !== 'success') {
      return "error";
    }
    return profileData.loggedInUser;
  }

  const getUserCommunities = async (username: string) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getcomms.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ "user": username })
    });
    const data = await res.json();
    return data
  }

  const updateUserStatus = async () => {
    // get the profile
    const profile = await verifyUserSession();
    console.log(profile);
    // get the communties they are in
    const communities = await getUserCommunities(profile)
    // check to see if this community is in that list
    if (communities.includes(communityData?.community_name)) {
      setJoined(true);
      return;
    }
    setJoined(false);
    return;
  }

  const removeCommunityFromUserProfile = async () => {
    console.log("removing comm from pfp");
      var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/removecomtopfp.php`, {
          method: 'POST', // Or 'GET' depending on your API
          headers: {
              'Content-Type': 'application/json',
              'CSRF-Token': csrfToken
          },
          body: JSON.stringify({
              "name": communityData?.community_name,
              "image": communityData?.picture,
              "user": await verifyUserSession()
          })
      });
      var results = await response.json();
      console.log(results)
  }

  const removeUserFromCommunityMemberList = async () => {
    var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/leave_community.php`, {
    method: 'POST', // Or 'GET' depending on your API
    headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken
    },
    body: JSON.stringify({
        "name": communityData?.community_name,
        "image": communityData?.picture,
        "user": await verifyUserSession()
    })
  });
  var results = await response.json();
  console.log(results)
  }

  const addCommunityToUserProfile = async () => {
    console.log("adding community to profile");
    var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/addcomtopfp.php`, {
        method: 'POST', // Or 'GET' depending on your API
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          "name": communityData?.community_name,
          "image": communityData?.picture,
          "user": await verifyUserSession()
        })
    });
    var results = await response.json();
    console.log(results)
  }

  const addUserToCommunityMemberList = async () => {
    console.log("adding user to  community");
    var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/join_community.php`, {
        method: 'POST', // Or 'GET' depending on your API
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          "name": communityData?.community_name,
          "image": communityData?.picture,
          "user": await verifyUserSession()
        })
    });
    var results = await response.json();
    console.log(results)

  }


  const handleJoinLeave = async () => {
    if (joined){
      await removeCommunityFromUserProfile();
      await removeUserFromCommunityMemberList();
    }
    if (!joined){
      await addUserToCommunityMemberList();
      await addCommunityToUserProfile();
    }
    await updateUserStatus();
  }

  return (
    <MainContent>
      <div>
        <h1>Community: {communityData?.community_name} </h1>
        <img src={communityData?.picture}></img>
        <h3>Members: {communityData?.members}</h3>
        <h3>member count: {communityData?.member_count}</h3>
        <h3>Posts:</h3>
        <ul>
          {communityData?.posts?.map((post) => (
            <li key={post.post_id}>
              <strong>{post.title}</strong> by {post.username}
            </li>
          ))}
        </ul>
        <button onClick={handleJoinLeave}>{joined ? "Leave Community" : "Join Community"}</button>

      </div>
      <Sidebar />
    </MainContent>
  );
};

export default CommunityPage;
