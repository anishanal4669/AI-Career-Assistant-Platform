"use client"; 
//This tells Next.js to run this file in the browser

import { useState } from "react";
//usestate helps to store state as memory. Allows to remember user input. 

export default function SignupPage() {

  //Created single state object to store all inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  //This function runs everytime there is a user input and updates only the specific field changing.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      //We spread the existing formData so previosuly entered values are not lost while updating.
      [e.target.name]: e.target.value,
      //This updates whichever field is input. If name= "email", it updates email. 
    });
  };

  //This function runs when there is form submisson. 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //prevents browser from refreshing the page on form submit 
    console.log("Signup Data:", formData);
    //This is where we send the data to backend later
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
      //The form calls handleSubmit when user clicks on submit. 
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}