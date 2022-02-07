import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {

  const { repos } = React.useContext(GithubContext)
  
  const chartData = [
    {
      label: "CSS",
      value: "46"
    },
    {
      label: "JavaScript",
      value: "36"
    },
    {
      label: "HTML",
      value: "15"
    },
    
  ];

  const languages = repos.reduce((total, repo)=>{
    const { language, stargazers_count } = repo

    if(!language) return total 
    //if the property is not in the total object, create it and assign 1 on 1st iteration
    if(!total[language]){
      total[language] = { label: language, value: 1, stars: stargazers_count}  
    } //if the property already exist, then return the old object and overwrite the value plus one
    else {
      total[language] = {...total[language], value: total[language].value + 1, stars: total[language].stars + stargazers_count}
    }

    //one line of code for the operation
    // if(language){
    //   total[language] = total[language] + 1 || 1
    // }

    return total
  }, {})
 
  //most used language
  const mostUsed = Object.values(languages)

  //most used language
  const mostPopular = Object.values(languages).map((item) => {
    return {...item, value: item.stars}
  })

  // stars, forks 

  let { stars, forks } = repos.reduce((total, repo)=>{

    const { stargazers_count, name, forks } = repo
    total.stars[stargazers_count] = {label: name, value: stargazers_count}
    total.forks[forks] = {label: name, value: forks}
    return total
  },{stars:{}, forks:{}})
  
  stars = Object.values(stars).slice(-5).reverse()
  forks = Object.values(forks).slice(-5).reverse()
  
  

  return (
  <section className="section">
    <Wrapper className="section-center">
      <Pie3D data={mostUsed} />
    <Column3D data={stars} />
    <Doughnut2D  data={mostPopular}/>
    <Bar3D  data={forks} />
    </Wrapper>

  </section>
  )};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
