import React, { useState, useRef, useEffect  } from "react";
import { useCSRFToken } from '../csrfContent';


interface Community {
    name: string,
}

const CommunityResultsProfile = () => {

    const [communities, setCommunities] = React.useState<Community[]>([]);

    const {csrfToken} = useCSRFToken();

    //onload 
    useEffect(() => {
        // Function to fetch communities
        const fetchCommunities = async () => {
            try {
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
                var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getcomms.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'CSRF-Token': csrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        "user": user
                    })
                });
                var result = await response.json();
                console.log(result);
                setCommunities(result.map((community: any) => ({
                    name: community,
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the fetch function when the component mounts
        fetchCommunities();
    }, []); // The empty array ensures this effect only runs once when the component is first mounted.



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
        <h1>My Comunities</h1>
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
