import React, { useState, useEffect, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

function GithubProvider({children}) {

    const [githubUser, setGithubUser] = useState(mockUser)
    const [repos, setRepos] = useState(mockRepos)
    const [followers, setFollowers] = useState(mockFollowers)
    
    const [requests, setRequests] = useState(0)
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState({show: false, msg: ''})

    async function searchGithubUser(user){
        toggleError()
        setLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`)
        .catch((error) => console.error(error))
        if(response){
            setGithubUser(response.data)
            const { login, followers_url, repos_url } = response.data
            /* to display all data at same time after fetch */
            // await axios(`${repos_url}`)
            // .then((response) => setRepos(response.data)).catch((error) => console.error(error))
            
            // await axios(`${followers_url}`)
            // .then((response) => setFollowers(response.data)).catch((error) => console.error(error))
            
            await Promise.allSettled([
                axios(`${repos_url}`), 
                axios(`${followers_url}`)
            ]).then((results)=> {
                const [repos, followers] = results;
                if(repos.status === "fulfilled") {
                    setRepos(repos.value.data)
                }
                if(followers.status === "fulfilled") {
                    setFollowers(followers.value.data)
                }
            }).catch((error) => console.error(error))
            
        }else {
            toggleError(true, "username not found!" )
        }
        checkRequests()
        setLoading(false)
    }

    function checkRequests(){
        axios(`${rootUrl}/rate_limit`)
        .then(({data}) => {
            let { rate: { remaining } } = data
            setRequests(remaining)
            if(remaining === 0){
                toggleError(true, 'you have exceeded your 60 requests per hour')
            }
        })
        .catch((error) => console.error(error))
    }

    function toggleError(show = false, msg = '') {
        setError({show, msg})
    }
    

    
    useEffect(
       checkRequests 
    ,[])

    return <GithubContext.Provider value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        loading,
    }}>{children}</GithubContext.Provider>
}

function useGlobalContext(){
    return useContext(GithubContext)
}

export { GithubProvider, useGlobalContext, GithubContext }
