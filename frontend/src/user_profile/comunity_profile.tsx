import React, { useState, useRef, useEffect  } from "react";
import { useCSRFToken } from '../csrfContent';


interface Community {
    name: string,
}

const CommunityResultsProfile = () => {

    const [communities, setCommunities] = React.useState<Community[]>([]);

    const {csrfToken} = useCSRFToken();

    useEffect(() => {
        const fetchCommunities = async () => {
          try {
            const profileRes = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,
              },
              credentials: 'include'
            });
            const profileData = await profileRes.json();
            if (profileData.status !== "success") {
              console.error("Could not fetch profile");
              return;
            }
      
            const user = profileData.loggedInUser;
      
            const commsRes = await fetch(`${process.env.REACT_APP_API_URL}backend/custom_communities/getCommunities.php`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,
              },
              credentials: 'include',
              body: JSON.stringify({ user }),
            });
      
            const commsData = await commsRes.json();
            if (Array.isArray(commsData)) {
              setCommunities(commsData.map((name) => ({ name })));
            } else {
              console.error("Unexpected response:", commsData);
            }
          } catch (err) {
            console.error("Error fetching user communities", err);
          }
        };
      
        fetchCommunities();
      }, [csrfToken]);
      



    const handleCommunityClick = async(community: Community) => {
        var response = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
            method: 'GET', // Or 'GET' depending on your API
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
        });
        var results = await response.json();
        if (results["status"] === "success") {
            var user = results["loggedInUser"];
            console.log(`user: ${user}`);
        } else {
            console.error("Error fetching profile:", results);
        }
        console.log("checking if user is part of the commuitty");
        var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/checkUser.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify({
                "name": community.name,
                "user": user
            })
        }); 
        var results = await response.json();
        console.log(results)
        // REMOVING
        if (results === true) {
            // remove user to community
            console.log("removing user to community");
            var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/leave_community.php`, {
                method: 'POST', // Or 'GET' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    "name": community.name,
                    "user": user
                })
            });
            var results = await response.json();
            console.log(results)

            // reove community from user profile
            console.log("removing comm from pfp");
            var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/removecomtopfp.php`, {
                method: 'POST', // Or 'GET' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    "name": community.name,
                    "user": user
                })
            });
            var results = await response.json();
            console.log(results)
        }
    };
    return (
        <div>
        <h1>My Communities</h1>
          {/* Map through the communities array and display the name */}
          {communities.map((community, index) => (
            <div key={index}>
              <p>{community.name}</p>
            </div>
          ))}
        </div>
      );
    };


export default CommunityResultsProfile;
