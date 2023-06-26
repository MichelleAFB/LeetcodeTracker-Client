import React from "react";

import { customStyles } from "../constants/customStyles";
import { languageOptions } from "../constants/languageOptions";
import { useState,useEffect } from "react";
import Select from "react-select";
const LanguagesDropdown = ({ onSelectChange }) => {

  const [languages,setLanguages]=useState()
  const[isLoading,setIsloading]=useState(true)

  const tryIt=async()=>{
    const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/languages',
  headers: {
    'content-type': 'application/octet-stream',
    'X-RapidAPI-Key': '00f165d168msh14ee358d2258223p12aa97jsne2c06db3d539',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
  return response.data
} catch (error) {
	console.error(error);
}
  }

  useEffect(()=>{
    var l
    const prom=new Promise((resolve,reject)=>{
      resolve()
      

    })

    prom.then(()=>{
      console.log(l)
        setIsloading(false)
    })
  })

  
  return (
    <Select
    placeholder={`Filter By Category`}
    options={languageOptions}
    styles={customStyles}
    defaultValue={languageOptions[0]}
    onChange={(selectedOption) => onSelectChange(selectedOption)}
  />
  );
  
};

export default LanguagesDropdown;
