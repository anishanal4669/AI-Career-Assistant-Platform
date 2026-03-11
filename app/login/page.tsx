"use client";
//This tells Next.js to run this file in the browser

import { useState } from "react";
//usestate helps to store state as memory. Allows to remember user input. 

export default function LoginPage() {

  //Using one object to store
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  ////This function runs everytime there is a user input and updates only the specific field changing.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
       //We spread the existing formData so previosuly entered values are not lost while updating.
      [e.target.name]: e.target.value,
      //Dynamically updates depending on which triggered the event
    });
  };

   // This function runs when the form is submitted.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prevents the browser from default refreshing the page.

    // Fake login check. Later on, this would send data to backend API
    if (formData.email === "test@test.com" && formData.password === "1234") {
      alert("Login Successful!");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    //This makes sure form is in center
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">

      <form
        onSubmit={handleSubmit}
        // When user clicks Login button, this function will start running. 
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Login
        </h2>

        <input
          type="email"
          name="email"  //helps handleChange know which field to update.
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded text-black placeholder-gray-500"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded text-black placeholder-gray-500"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}